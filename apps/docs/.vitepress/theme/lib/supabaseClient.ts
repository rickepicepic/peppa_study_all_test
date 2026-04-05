import { createClient } from '@supabase/supabase-js';
import type { ApiClient, SyncProgressItem, SyncProgressResponse } from './apiClient';

interface SupabaseClientOptions {
  supabaseURL: string;
  anonKey: string;
  guestUserId: string;
}

interface SupabaseReadOptions {
  supabaseURL: string;
  anonKey: string;
  userId: string;
  nodeId: string;
  subject?: string;
  accessToken?: string;
}

export async function loadSupabaseNodeProgress(options: SupabaseReadOptions): Promise<SyncProgressItem | null> {
  const supabase = createClient(options.supabaseURL, options.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}
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

  if (error) {
    throw new Error(`supabase read failed: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    nodeId: String(data.node_id),
    completed: Boolean(data.completed),
    updatedAt: String(data.updated_at)
  };
}

export function createSupabaseProgressClient(options: SupabaseClientOptions): ApiClient {
  const createSupabase = (accessToken?: string) =>
    createClient(options.supabaseURL, options.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      },
      global: {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {}
      }
    });

  return {
    async syncProgress(
      items: SyncProgressItem[],
      _mergeToken: string,
      token?: string,
      userId?: string
    ): Promise<SyncProgressResponse> {
      if (items.length === 0) {
        return { merged: 0, items: [] };
      }

      const supabase = createSupabase(token);
      const userID = userId && userId.trim().length > 0 ? userId : options.guestUserId;

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

      const firstNodeId = items[0]?.nodeId;
      if (firstNodeId) {
        const { data: verifyRow, error: verifyError } = await supabase
          .from('user_progress')
          .select('user_id, node_id, updated_at')
          .eq('user_id', userID)
          .eq('subject', 'network')
          .eq('node_id', firstNodeId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (verifyError) {
          throw new Error(`supabase verify failed: ${verifyError.message}`);
        }

        if (!verifyRow) {
          throw new Error('supabase verify failed: write acknowledged but no row is visible');
        }
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