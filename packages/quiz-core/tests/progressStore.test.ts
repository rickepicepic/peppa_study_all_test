import { describe, expect, it } from 'vitest';
import { createProgressStore } from '../src/progressStore';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function createMemoryStorage(): StorageLike {
  const data = new Map<string, string>();
  return {
    getItem(key: string) {
      return data.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    }
  };
}

describe('progressStore', () => {
  it('persists and reads node progress', () => {
    const store = createProgressStore('nfp-test', { storage: createMemoryStorage() });

    store.saveNodeProgress('network/system/tcp-basic', {
      completed: true,
      updatedAt: '2026-04-05T10:00:00Z'
    });

    const value = store.getNodeProgress('network/system/tcp-basic');
    expect(value).toEqual({
      completed: true,
      updatedAt: '2026-04-05T10:00:00Z'
    });
  });

  it('isolates data by namespace', () => {
    const storage = createMemoryStorage();
    const storeA = createProgressStore('ns-a', { storage });
    const storeB = createProgressStore('ns-b', { storage });

    storeA.saveNodeProgress('network/system/tcp-basic', {
      completed: true,
      updatedAt: '2026-04-05T10:00:00Z'
    });

    expect(storeB.getNodeProgress('network/system/tcp-basic')).toBeUndefined();
  });

  it('returns undefined for unknown node id', () => {
    const store = createProgressStore('nfp-test', { storage: createMemoryStorage() });
    expect(store.getNodeProgress('network/system/missing')).toBeUndefined();
  });
});