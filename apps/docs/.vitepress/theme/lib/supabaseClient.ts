import { createClient } from '@supabase/supabase-js';
import type { ApiClient, SyncProgressItem, SyncProgressResponse } from './apiClient';

interface SupabaseClientOptions {
  supabaseURL: string;
  anonKey: string;
  guestUserId: number;
}

export function createSupabaseProgressClient(options: SupabaseClientOptions): ApiClient {
  const supabase = createClient(options.supabaseURL, options.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return {
    async syncProgress(items: SyncProgressItem[], _mergeToken: string, token?: string): Promise<SyncProgressResponse> {
      if (items.length === 0) {
        return { merged: 0, items: [] };
      }

      const tokenUserId = Number.parseInt(token ?? '', 10);
      const userID = Number.isNaN(tokenUserId) ? options.guestUserId : tokenUserId;

      const rows = items.map((item) => ({
        user_id: userID,
        subject: 'network',
        node_id: item.nodeId,
        completed: item.completed,
        updated_at: item.updatedAt
      }));

      const { error } = await supabase.from('user_progress').upsert(rows, {
        onConflict: 'user_id,subject,node_id'
      });

      if (error) {
        throw new Error(`supabase sync failed: ${error.message}`);
      }

      return {
        merged: items.length,
        items: items.map((item) => ({
          nodeId: item.nodeId,
          completed: item.completed,
          updatedAt: item.updatedAt
        }))
      };
    }
  };
}