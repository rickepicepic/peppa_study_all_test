<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { createProgressStore } from '../../../../../packages/quiz-core/src/progressStore';
import { createApiClient } from '../lib/apiClient';
import {
  deriveStableNumericUserId,
  getCurrentUser,
  getSupabaseAuthClient,
  signInWithPassword,
  signOut
} from '../lib/supabaseAuth';
import { createSupabaseProgressClient } from '../lib/supabaseClient';
import { syncProgress } from '../lib/syncBridge';

type QuizType = 'single' | 'multiple' | 'boolean';

interface QuizQuestion {
  id: string;
  title: string;
  type: QuizType;
  options: string[];
  correct: string[];
  explanation: string;
}

const props = defineProps<{
  quizId?: string;
}>();

const progressStore = createProgressStore('nfp-guest');
const started = ref(false);
const submitted = ref(false);
const answers = reactive<Record<string, string[]>>({});
const lastProgressAt = ref<string | null>(null);
const syncStatus = ref<'idle' | 'local' | 'cloud' | 'failed'>('idle');
const loginEmail = ref('');
const loginPassword = ref('');
const loginBusy = ref(false);
const loginMessage = ref('');
const authUser = ref<{ id: string; email: string } | null>(null);

const backendMode = (import.meta.env.VITE_BACKEND_MODE as string | undefined) ?? 'local';
const apiBaseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const apiEnabled =
  (backendMode === 'api' || (import.meta.env.VITE_API_ENABLED === 'true' && backendMode !== 'supabase')) &&
  !!apiBaseURL;
const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true';
const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabaseGuestUserIdRaw = import.meta.env.VITE_SUPABASE_GUEST_USER_ID as string | undefined;
const supabaseGuestUserId = Number.parseInt(supabaseGuestUserIdRaw ?? '1', 10);

const apiClient = apiBaseURL ? createApiClient(apiBaseURL) : undefined;
const supabaseClient =
  supabaseURL && supabaseAnonKey
    ? createSupabaseProgressClient({
        supabaseURL,
        anonKey: supabaseAnonKey,
        guestUserId: Number.isNaN(supabaseGuestUserId) ? 1 : supabaseGuestUserId
      })
    : undefined;

const supabaseAuthClient =
  supabaseURL && supabaseAnonKey ? getSupabaseAuthClient(supabaseURL, supabaseAnonKey) : undefined;

const activeClient = backendMode === 'supabase' ? supabaseClient : apiClient;

const isSupabaseMode = backendMode === 'supabase';
const effectiveGuestId = Number.isNaN(supabaseGuestUserId) ? 1 : supabaseGuestUserId;

const supabaseSyncUserToken = computed(() => {
  if (!isSupabaseMode) {
    return undefined;
  }
  if (authEnabled && !authUser.value) {
    return undefined;
  }
  if (authUser.value) {
    return String(deriveStableNumericUserId(authUser.value.id));
  }
  return String(effectiveGuestId);
});

const supabaseSyncIdentityLabel = computed(() => {
  if (authUser.value) {
    return `${authUser.value.email} (uid:${deriveStableNumericUserId(authUser.value.id)})`;
  }
  return `guest-${effectiveGuestId}`;
});

async function refreshSupabaseUser() {
  if (!supabaseAuthClient) {
    authUser.value = null;
    return;
  }
  authUser.value = await getCurrentUser(supabaseAuthClient);
}

async function handleSupabaseLogin() {
  if (!supabaseAuthClient || !loginEmail.value || !loginPassword.value) {
    loginMessage.value = '请输入邮箱与密码。';
    return;
  }
  loginBusy.value = true;
  loginMessage.value = '';
  try {
    await signInWithPassword(supabaseAuthClient, loginEmail.value, loginPassword.value);
    await refreshSupabaseUser();
    loginPassword.value = '';
    loginMessage.value = '登录成功，后续进度将写入数据库。';
  } catch (error) {
    const msg = error instanceof Error ? error.message : '登录失败';
    loginMessage.value = msg;
  } finally {
    loginBusy.value = false;
  }
}

async function handleSupabaseLogout() {
  if (!supabaseAuthClient) {
    return;
  }
  loginBusy.value = true;
  try {
    await signOut(supabaseAuthClient);
    authUser.value = null;
    loginMessage.value = '已退出登录。';
  } catch (error) {
    const msg = error instanceof Error ? error.message : '退出失败';
    loginMessage.value = msg;
  } finally {
    loginBusy.value = false;
  }
}

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    title: 'TCP 三次握手中，第二次报文通常包含什么标志位？',
    type: 'single',
    options: ['A', 'B', 'C'],
    correct: ['B'],
    explanation: '服务端回复 SYN + ACK，确认客户端初始序号并同步自己的初始序号。'
  },
  {
    id: 'q2',
    title: '以下哪些属于传输层协议？',
    type: 'multiple',
    options: ['TCP', 'UDP', 'IP'],
    correct: ['TCP', 'UDP'],
    explanation: 'TCP 和 UDP 属于传输层，IP 属于网络层。'
  },
  {
    id: 'q3',
    title: 'HTTP 一定是无状态协议。',
    type: 'boolean',
    options: ['true', 'false'],
    correct: ['true'],
    explanation: 'HTTP 协议本身无状态，业务可通过 Cookie/Session 等机制补充状态。'
  }
];

function startQuiz() {
  started.value = true;
  submitted.value = false;
  for (const key of Object.keys(answers)) {
    delete answers[key];
  }
}

function toggleSingle(questionId: string, option: string) {
  answers[questionId] = [option];
}

function toggleMultiple(questionId: string, option: string, checked: boolean) {
  const current = new Set(answers[questionId] ?? []);
  if (checked) {
    current.add(option);
  } else {
    current.delete(option);
  }
  answers[questionId] = [...current];
}

function normalize(values: string[]) {
  return [...values].sort().join('|');
}

const details = computed(() => {
  return questions.map((question) => {
    const user = answers[question.id] ?? [];
    return {
      id: question.id,
      title: question.title,
      isCorrect: normalize(user) === normalize(question.correct),
      explanation: question.explanation,
      correct: question.correct.join(', '),
      user: user.join(', ') || '(未作答)'
    };
  });
});

const correctCount = computed(() => details.value.filter((item) => item.isCorrect).length);
const total = computed(() => questions.length);
const score = computed(() => (total.value === 0 ? 0 : Math.round((correctCount.value / total.value) * 100)));

async function submitQuiz() {
  submitted.value = true;
  const updatedAt = new Date().toISOString();
  progressStore.saveNodeProgress(panelId.value, {
    completed: true,
    updatedAt
  });
  lastProgressAt.value = updatedAt;

  try {
    const result = await syncProgress({
      apiEnabled: backendMode === 'supabase' ? !!supabaseClient : apiEnabled,
      authEnabled,
      localItems: [
        {
          nodeId: panelId.value,
          completed: true,
          updatedAt
        }
      ],
      mergeToken: `${panelId.value}-${updatedAt}`,
      token:
        backendMode === 'supabase'
          ? supabaseSyncUserToken.value
          : authEnabled
            ? localStorage.getItem('nfp-auth-token') ?? undefined
            : undefined,
      client: activeClient
    });
    syncStatus.value = result.mode;
  } catch {
    syncStatus.value = 'failed';
  }
}

const panelId = computed(() => props.quizId ?? 'quiz-panel-default');

function loadProgress() {
  const progress = progressStore.getNodeProgress(panelId.value);
  lastProgressAt.value = progress?.updatedAt ?? null;
}

onMounted(async () => {
  loadProgress();
  if (isSupabaseMode) {
    await refreshSupabaseUser();
  }
});
watch(panelId, loadProgress);
</script>

<template>
  <section class="quiz-panel" :data-quiz-id="panelId">
    <h2>小测验</h2>
    <p class="hint">支持单选、多选、判断。提交后可查看解析。</p>
    <section v-if="isSupabaseMode" class="auth-panel">
      <h3 class="auth-title">账号状态</h3>
      <p class="progress-hint">当前同步身份：{{ supabaseSyncIdentityLabel }}</p>

      <div v-if="authEnabled && !authUser" class="auth-form">
        <input v-model="loginEmail" type="email" placeholder="邮箱" class="auth-input" />
        <input v-model="loginPassword" type="password" placeholder="密码" class="auth-input" />
        <button class="action" type="button" :disabled="loginBusy" @click="handleSupabaseLogin">
          {{ loginBusy ? '登录中...' : '登录' }}
        </button>
      </div>

      <div v-if="authEnabled && authUser" class="auth-form">
        <button class="action" type="button" :disabled="loginBusy" @click="handleSupabaseLogout">
          {{ loginBusy ? '处理中...' : '退出登录' }}
        </button>
      </div>

      <p v-if="loginMessage" class="progress-hint">{{ loginMessage }}</p>
    </section>
    <p v-if="lastProgressAt" class="progress-hint">最近完成时间：{{ lastProgressAt }}</p>
    <p v-if="syncStatus === 'local'" class="progress-hint">当前为本地进度模式</p>
    <p v-if="syncStatus === 'cloud'" class="progress-hint">已同步到云端进度</p>
    <p v-if="syncStatus === 'failed'" class="progress-hint">云端同步失败，已保留本地进度</p>

    <button v-if="!started" class="action" type="button" @click="startQuiz">开始测验</button>

    <form v-else class="quiz-form" @submit.prevent="submitQuiz">
      <fieldset v-for="question in questions" :key="question.id" class="question">
        <legend>{{ question.title }}</legend>

        <label v-for="option in question.options" :key="`${question.id}-${option}`" class="option">
          <input
            v-if="question.type === 'single' || question.type === 'boolean'"
            :name="question.id"
            type="radio"
            :value="option"
            :checked="(answers[question.id] ?? []).includes(option)"
            @change="toggleSingle(question.id, option)"
          />
          <input
            v-else
            :name="`${question.id}-${option}`"
            type="checkbox"
            :value="option"
            :checked="(answers[question.id] ?? []).includes(option)"
            @change="toggleMultiple(question.id, option, ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ option }}</span>
        </label>
      </fieldset>

      <button class="action" type="submit">提交</button>
    </form>

    <section v-if="submitted" class="result" aria-live="polite">
      <h3>结果</h3>
      <p>得分：{{ score }}（{{ correctCount }}/{{ total }}）</p>

      <h3>解析</h3>
      <article v-for="item in details" :key="item.id" class="analysis-item">
        <p><strong>{{ item.title }}</strong></p>
        <p>你的答案：{{ item.user }}</p>
        <p>正确答案：{{ item.correct }}</p>
        <p>判定：{{ item.isCorrect ? '正确' : '错误' }}</p>
        <p>解析：{{ item.explanation }}</p>
      </article>
    </section>
  </section>
</template>

<style scoped>
.quiz-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

.hint {
  margin-bottom: 12px;
}

.auth-panel {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
}

.auth-title {
  margin: 0 0 8px;
}

.auth-form {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.auth-input {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 6px 8px;
}

.progress-hint {
  margin-bottom: 12px;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.quiz-form {
  display: grid;
  gap: 12px;
}

.question {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  padding: 10px;
}

.option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
}

.action {
  width: fit-content;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.result {
  margin-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 12px;
}

.analysis-item {
  margin: 12px 0;
  padding: 8px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}
</style>
