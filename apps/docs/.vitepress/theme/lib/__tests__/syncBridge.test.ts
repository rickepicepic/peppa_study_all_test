import { describe, expect, it, vi } from 'vitest';
import { syncProgress } from '../syncBridge';

describe('syncProgress', () => {
  it('keeps local mode when api disabled', async () => {
    const result = await syncProgress({
      apiEnabled: false,
      authEnabled: false,
      localItems: []
    });

    expect(result.mode).toBe('local');
    expect(result.merged).toBe(0);
  });

  it('calls sync api when enabled', async () => {
    const client = {
      syncProgress: vi.fn().mockResolvedValue({ merged: 1 })
    } as any;

    const result = await syncProgress({
      apiEnabled: true,
      authEnabled: false,
      localItems: [
        {
          nodeId: 'network/system/tcp',
          completed: true,
          updatedAt: '2026-04-05T12:00:00Z'
        }
      ],
      client
    });

    expect(client.syncProgress).toHaveBeenCalledTimes(1);
    expect(result.mode).toBe('cloud');
    expect(result.merged).toBe(1);
  });
});
