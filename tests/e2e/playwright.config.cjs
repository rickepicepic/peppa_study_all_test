const { defineConfig } = require('@playwright/test');
const path = require('node:path');

const docsDir = path.resolve(__dirname, '../../apps/docs');

module.exports = defineConfig({
  testDir: __dirname,
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:5173'
  },
  webServer: {
    command: 'pnpm dev',
    cwd: docsDir,
    port: 5173,
    reuseExistingServer: !process.env.CI
  }
});
