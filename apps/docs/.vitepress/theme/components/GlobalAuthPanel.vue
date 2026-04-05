<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  getCurrentUser,
  getSupabaseAuthClient,
  signInWithPassword,
  signOut,
  signUpWithPassword
} from '../lib/supabaseAuth';

const backendMode = (import.meta.env.VITE_BACKEND_MODE as string | undefined) ?? 'local';
const authEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true';
const supabaseURL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabaseGuestUserIdRaw = import.meta.env.VITE_SUPABASE_GUEST_USER_ID as string | undefined;
const supabaseGuestUserId =
  supabaseGuestUserIdRaw && supabaseGuestUserIdRaw.trim().length > 0
    ? supabaseGuestUserIdRaw.trim()
    : '00000000-0000-0000-0000-000000000001';

const isSupabaseAuthActive = backendMode === 'supabase' && authEnabled && !!supabaseURL && !!supabaseAnonKey;
const supabaseAuthClient =
  isSupabaseAuthActive && supabaseURL && supabaseAnonKey
    ? getSupabaseAuthClient(supabaseURL, supabaseAnonKey)
    : undefined;

const expanded = ref(false);
const loading = ref(false);
const message = ref('');
const email = ref('');
const password = ref('');
const user = ref<{ id: string; email: string } | null>(null);

const identityLabel = computed(() => {
  if (user.value) {
    return `${user.value.email} (${user.value.id})`;
  }
  return `游客模式 ${supabaseGuestUserId}`;
});

async function refreshUser() {
  if (!supabaseAuthClient) {
    user.value = null;
    return;
  }
  user.value = await getCurrentUser(supabaseAuthClient);
}

async function handleLogin() {
  if (!supabaseAuthClient) {
    return;
  }
  if (!email.value || !password.value) {
    message.value = '请输入邮箱与密码。';
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    await signInWithPassword(supabaseAuthClient, email.value, password.value);
    await refreshUser();
    password.value = '';
    message.value = '登录成功。';
  } catch (error) {
    message.value = error instanceof Error ? error.message : '登录失败';
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  if (!supabaseAuthClient) {
    return;
  }
  if (!email.value || !password.value) {
    message.value = '请输入邮箱与密码。';
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    await signUpWithPassword(supabaseAuthClient, email.value, password.value);
    message.value = '注册请求已提交，请检查邮箱确认。';
  } catch (error) {
    message.value = error instanceof Error ? error.message : '注册失败';
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  if (!supabaseAuthClient) {
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    await signOut(supabaseAuthClient);
    await refreshUser();
    message.value = '已退出登录。';
  } catch (error) {
    message.value = error instanceof Error ? error.message : '退出失败';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!isSupabaseAuthActive) {
    return;
  }
  await refreshUser();
  if (!supabaseAuthClient) {
    return;
  }
  supabaseAuthClient.auth.onAuthStateChange(() => {
    void refreshUser();
  });
});
</script>

<template>
  <div v-if="isSupabaseAuthActive" class="global-auth">
    <button class="global-auth-toggle" type="button" @click="expanded = !expanded">
      {{ user ? '账号' : '登录/注册' }}
    </button>

    <div v-if="expanded" class="global-auth-panel">
      <p class="global-auth-title">账号中心</p>
      <p class="global-auth-desc">{{ identityLabel }}</p>

      <div v-if="!user" class="global-auth-form">
        <input v-model="email" type="email" placeholder="邮箱" class="global-auth-input" />
        <input v-model="password" type="password" placeholder="密码" class="global-auth-input" />
        <div class="global-auth-actions">
          <button type="button" class="global-auth-btn" :disabled="loading" @click="handleLogin">
            {{ loading ? '处理中...' : '登录' }}
          </button>
          <button type="button" class="global-auth-btn" :disabled="loading" @click="handleRegister">
            注册
          </button>
        </div>
      </div>

      <div v-else class="global-auth-actions">
        <button type="button" class="global-auth-btn" :disabled="loading" @click="handleLogout">
          {{ loading ? '处理中...' : '退出登录' }}
        </button>
      </div>

      <p v-if="message" class="global-auth-msg">{{ message }}</p>
    </div>
  </div>
</template>
