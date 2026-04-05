import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedKey = '';
let cachedClient: SupabaseClient | undefined;

export function getSupabaseAuthClient(supabaseURL: string, anonKey: string): SupabaseClient {
  const cacheKey = `${supabaseURL}|${anonKey}`;
  if (!cachedClient || cachedKey !== cacheKey) {
    cachedKey = cacheKey;
    cachedClient = createClient(supabaseURL, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return cachedClient;
}

export async function signInWithPassword(client: SupabaseClient, email: string, password: string): Promise<void> {
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signUpWithPassword(client: SupabaseClient, email: string, password: string): Promise<void> {
  const { error } = await client.auth.signUp({ email, password });
  if (error) {
    throw new Error(error.message);
  }
}

export async function signOut(client: SupabaseClient): Promise<void> {
  const { error } = await client.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentUser(client: SupabaseClient): Promise<{ id: string; email: string } | null> {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return {
    id: data.user.id,
    email: data.user.email ?? data.user.id
  };
}

export function deriveStableNumericUserId(raw: string): number {
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i += 1) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const positive = hash >>> 0;
  return 100000000 + (positive % 900000000);
}