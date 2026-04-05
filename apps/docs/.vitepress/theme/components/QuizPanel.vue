<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { createProgressStore } from '../../../../../packages/quiz-core/src/progressStore';
import { createApiClient } from '../lib/apiClient';
import { getCurrentUser, getSupabaseAuthClient } from '../lib/supabaseAuth';
import { createSupabaseProgressClient, loadSupabaseNodeProgress } from '../lib/supabaseClient';
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
const syncErrorMessage = ref('');
const authUser = ref<{ id: string; email: string } | null>(null);
const authAccessToken = ref<string | undefined>(undefined);

const backendMode = (import.meta.env.VITE_BACKEND_MODE as string | undefined) ?? 'local';
const apiBaseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;
const apiEnabled =
  (backendMode === 'api' || (import.meta.env.VITE_API_ENABLED === 'true' && backendMode !== 'supabase')) &&
  !!apiBaseURL;
const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true';
const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabaseGuestUserIdRaw = import.meta.env.VITE_SUPABASE_GUEST_USER_ID as string | undefined;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const supabaseGuestUserId =
  supabaseGuestUserIdRaw && uuidPattern.test(supabaseGuestUserIdRaw.trim())
    ? supabaseGuestUserIdRaw.trim()
    : '00000000-0000-0000-0000-000000000001';

const apiClient = apiBaseURL ? createApiClient(apiBaseURL) : undefined;
const supabaseClient =
  supabaseURL && supabaseAnonKey
    ? createSupabaseProgressClient({
        supabaseURL,
        anonKey: supabaseAnonKey,
        guestUserId: supabaseGuestUserId
      })
    : undefined;

const supabaseAuthClient =
  supabaseURL && supabaseAnonKey ? getSupabaseAuthClient(supabaseURL, supabaseAnonKey) : undefined;

const activeClient = backendMode === 'supabase' ? supabaseClient : apiClient;

const isSupabaseMode = backendMode === 'supabase';
const effectiveGuestId = supabaseGuestUserId;

const supabaseSyncIdentityLabel = computed(() => {
  if (authUser.value) {
    return `${authUser.value.email} (${authUser.value.id})`;
  }
  return `guest-${effectiveGuestId}`;
});

async function refreshSupabaseUser() {
  if (!supabaseAuthClient) {
    authUser.value = null;
    authAccessToken.value = undefined;
    return;
  }
  authUser.value = await getCurrentUser(supabaseAuthClient);
  const { data } = await supabaseAuthClient.auth.getSession();
  authAccessToken.value = data.session?.access_token;
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
  },
  {
    id: 'q4',
    title: '下列哪个协议用于域名解析？',
    type: 'single',
    options: ['DNS', 'ARP', 'ICMP'],
    correct: ['DNS'],
    explanation: 'DNS 负责将域名解析为 IP 地址。'
  },
  {
    id: 'q5',
    title: '以下哪些属于应用层协议？',
    type: 'multiple',
    options: ['HTTP', 'SMTP', 'TCP'],
    correct: ['HTTP', 'SMTP'],
    explanation: 'HTTP 和 SMTP 属于应用层，TCP 属于传输层。'
  },
  {
    id: 'q6',
    title: 'HTTPS 相比 HTTP 的核心增强是加密传输。',
    type: 'boolean',
    options: ['true', 'false'],
    correct: ['true'],
    explanation: 'HTTPS 在 HTTP 基础上引入 TLS，提供机密性和完整性。'
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
  if (isSupabaseMode) {
    await refreshSupabaseUser();
  }
  submitted.value = true;
  syncErrorMessage.value = '';
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
          ? authUser.value
            ? authAccessToken.value
            : undefined
          : authEnabled
            ? localStorage.getItem('nfp-auth-token') ?? undefined
            : undefined,
      userId: backendMode === 'supabase' ? (authUser.value ? authUser.value.id : effectiveGuestId) : undefined,
      client: activeClient
    });
    syncStatus.value = result.mode;
    if (result.mode === 'local') {
      if (result.reason === 'auth-required') {
        syncStatus.value = 'failed';
        syncErrorMessage.value = '未登录，未执行云端写入。请先在右上角登录后再提交。';
      } else if (result.reason === 'backend-unavailable') {
        syncStatus.value = 'failed';
        syncErrorMessage.value = '云端同步未启用或配置缺失（请检查 Supabase URL/Anon Key 与构建变量）。';
      }
    }
  } catch (error) {
    syncStatus.value = 'failed';
    syncErrorMessage.value = error instanceof Error ? error.message : '未知同步错误';
  }
}

const panelId = computed(() => props.quizId ?? 'quiz-panel-default');

function loadProgress() {
  const progress = progressStore.getNodeProgress(panelId.value);
  lastProgressAt.value = progress?.updatedAt ?? null;
}

async function loadProgressFromCloud() {
  if (!isSupabaseMode || !supabaseURL || !supabaseAnonKey) {
    return;
  }

  await refreshSupabaseUser();
  const userId = authUser.value ? authUser.value.id : effectiveGuestId;
  const cloudProgress = await loadSupabaseNodeProgress({
    supabaseURL,
    anonKey: supabaseAnonKey,
    userId,
    nodeId: panelId.value,
    subject: 'network',
    accessToken: authUser.value ? authAccessToken.value : undefined
  });

  if (!cloudProgress) {
    return;
  }

  progressStore.saveNodeProgress(panelId.value, {
    completed: cloudProgress.completed,
    updatedAt: cloudProgress.updatedAt
  });
  lastProgressAt.value = cloudProgress.updatedAt;
  syncStatus.value = 'cloud';
}

onMounted(async () => {
  loadProgress();
  if (isSupabaseMode) {
    try {
      await loadProgressFromCloud();
    } catch (error) {
      syncStatus.value = 'failed';
      syncErrorMessage.value = error instanceof Error ? error.message : '加载云端进度失败';
    }
  }
});
watch(panelId, async () => {
  loadProgress();
  if (isSupabaseMode) {
    try {
      await loadProgressFromCloud();
    } catch (error) {
      syncStatus.value = 'failed';
      syncErrorMessage.value = error instanceof Error ? error.message : '加载云端进度失败';
    }
  }
});
</script>

<template>
  <section class="quiz-panel" :data-quiz-id="panelId">
    <h2>小测验</h2>
    <p class="hint">支持单选、多选、判断。提交后可查看解析。</p>
    <section v-if="isSupabaseMode" class="auth-panel">
      <h3 class="auth-title">账号状态</h3>
      <p class="progress-hint">当前同步身份：{{ supabaseSyncIdentityLabel }}</p>
      <p v-if="authEnabled && !authUser" class="progress-hint">请在右上角使用登录入口后再提交测验进行云端同步。</p>
    </section>
    <p v-if="lastProgressAt" class="progress-hint">最近完成时间：{{ lastProgressAt }}</p>
    <p v-if="syncStatus === 'local'" class="progress-hint">当前为本地进度模式</p>
    <p v-if="syncStatus === 'cloud'" class="progress-hint">已同步到云端进度</p>
    <p v-if="syncStatus === 'failed'" class="progress-hint">云端同步失败，已保留本地进度</p>
    <p v-if="syncErrorMessage" class="progress-hint">错误详情：{{ syncErrorMessage }}</p>

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
