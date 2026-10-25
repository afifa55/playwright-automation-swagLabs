import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ListPage } from '../pages/ListPage';
import { env } from '../utils/env';
import { authFile } from '../utils/testData';
import { logger } from '../utils/logger';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const listPage = new ListPage(page);

  await setup.step('Log in with standard user', async () => {
    await loginPage.goto();
    await loginPage.login(env.standardUser, env.password);
  });

  await setup.step('Verify list page is displayed', async () => {
    await listPage.expectLoaded();
  });

  await setup.step('Save session state', async () => {
    await page.context().storageState({ path: authFile });
    logger.info(`Session saved to ${authFile} for ${env.standardUser}`);
  });
});
