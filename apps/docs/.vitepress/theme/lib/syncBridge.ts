import type { ApiClient, SyncProgressItem } from './apiClient';

export interface SyncInput {
  apiEnabled: boolean;
  authEnabled: boolean;
  localItems: SyncProgressItem[];
  mergeToken?: string;
  token?: string;
  userId?: string;
  client?: ApiClient;
}

export interface SyncResult {
  mode: 'local' | 'cloud';
  merged: number;
  reason?: 'backend-unavailable' | 'auth-required';
}

export async function syncProgress(input: SyncInput): Promise<SyncResult> {
  if (!input.apiEnabled || !input.client) {
    return { mode: 'local', merged: 0, reason: 'backend-unavailable' };
  }

  if (input.authEnabled && !input.token) {
    return { mode: 'local', merged: 0, reason: 'auth-required' };
  }

  const mergeToken = input.mergeToken ?? `merge-${Date.now()}`;
  const res = await input.client.syncProgress(input.localItems, mergeToken, input.token, input.userId);
  return { mode: 'cloud', merged: res.merged ?? 0 };
}
