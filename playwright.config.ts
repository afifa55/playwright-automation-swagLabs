import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/env';
import { authFile } from './utils/testData';

const browsers = [
  { name: 'chromium', device: devices['Desktop Chrome'] },
  { name: 'firefox', device: devices['Desktop Firefox'] },
  { name: 'webkit', device: devices['Desktop Safari'] },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: env.baseUrl,
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    ...browsers.map(({ name, device }) => ({
      name,
      use: { ...device, storageState: authFile },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts/,
    })),
  ],
});
