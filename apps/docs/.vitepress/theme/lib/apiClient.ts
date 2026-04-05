export interface SyncProgressItem {
  nodeId: string;
  completed: boolean;
  updatedAt: string;
}

export interface SyncProgressResponse {
  merged: number;
  items: Array<{ nodeId?: string; completed: boolean; updatedAt: string }>;
}

export interface ApiClient {
  syncProgress(items: SyncProgressItem[], mergeToken: string, token?: string): Promise<SyncProgressResponse>;
}

export function createApiClient(baseURL: string): ApiClient {
  return {
    async syncProgress(items, mergeToken, token) {
      const res = await fetch(`${baseURL}/api/v1/progress/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          mergeToken,
          subject: 'network',
          items
        })
      });

      if (!res.ok) {
        throw new Error(`sync failed with status ${res.status}`);
      }

      return (await res.json()) as SyncProgressResponse;
    }
  };
}
