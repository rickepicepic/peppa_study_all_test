import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.resolve(__dirname, '../../apps/docs');

export default defineConfig({
  testDir: __dirname,
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: {
    command: 'pnpm dev -- --host 127.0.0.1 --port 4173',
    cwd: docsDir,
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
