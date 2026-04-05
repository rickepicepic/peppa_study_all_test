import type { ApiClient, SyncProgressItem } from './apiClient';

export interface SyncInput {
  apiEnabled: boolean;
  authEnabled: boolean;
  localItems: SyncProgressItem[];
  mergeToken?: string;
  token?: string;
  client?: ApiClient;
}

export interface SyncResult {
  mode: 'local' | 'cloud';
  merged: number;
}

export async function syncProgress(input: SyncInput): Promise<SyncResult> {
  if (!input.apiEnabled || !input.client) {
    return { mode: 'local', merged: 0 };
  }

  if (input.authEnabled && !input.token) {
    return { mode: 'local', merged: 0 };
  }

  const mergeToken = input.mergeToken ?? `merge-${Date.now()}`;
  const res = await input.client.syncProgress(input.localItems, mergeToken, input.token);
  return { mode: 'cloud', merged: res.merged ?? 0 };
}
