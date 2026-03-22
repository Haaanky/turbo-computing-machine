// @ts-check
const { defineConfig } = require('/opt/node22/lib/node_modules/playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 15000,
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
});
