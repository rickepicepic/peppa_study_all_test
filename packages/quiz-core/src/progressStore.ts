export interface NodeProgress {
  completed: boolean;
  updatedAt: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressStoreOptions {
  storage?: StorageLike;
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

export function createProgressStore(namespace: string, options: ProgressStoreOptions = {}) {
  const key = `${namespace}:node-progress`;
  const storage = options.storage ?? globalThis.localStorage ?? createMemoryStorage();

  function readAll(): Record<string, NodeProgress> {
    const raw = storage.getItem(key);
    if (!raw) {
      return {};
    }

    try {
      return JSON.parse(raw) as Record<string, NodeProgress>;
    } catch {
      return {};
    }
  }

  function writeAll(data: Record<string, NodeProgress>) {
    storage.setItem(key, JSON.stringify(data));
  }

  return {
    saveNodeProgress(nodeId: string, progress: NodeProgress) {
      const data = readAll();
      data[nodeId] = progress;
      writeAll(data);
    },
    getNodeProgress(nodeId: string) {
      return readAll()[nodeId];
    }
  };
}