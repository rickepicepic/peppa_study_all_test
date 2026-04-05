import { createClient } from '@supabase/supabase-js';
import type { ApiClient, SyncProgressItem, SyncProgressResponse } from './apiClient';

interface SupabaseClientOptions {
  supabaseURL: string;
  anonKey: string;
  guestUserId: number;
}

interface SupabaseReadOptions {
  supabaseURL: string;
  anonKey: string;
  userId: number;
  nodeId: string;
  subject?: string;
}

export async function loadSupabaseNodeProgress(options: SupabaseReadOptions): Promise<SyncProgressItem | null> {
  const supabase = createClient(options.supabaseURL, options.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const subject = options.subject ?? 'network';
  const { data, error } = await supabase
    .from('user_progress')
    .select('node_id, completed, updated_at')
    .eq('user_id', options.userId)
    .eq('subject', subject)
    .eq('node_id', options.nodeId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    nodeId: String(data.node_id),
    completed: Boolean(data.completed),
    updatedAt: String(data.updated_at)
  };
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