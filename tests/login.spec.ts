import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ListPage } from '../pages/ListPage';
import { env } from '../utils/env';
import { messages, titles } from '../utils/testData';
import { logger } from '../utils/logger';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  let loginPage: LoginPage;
  let listPage: ListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    listPage = new ListPage(page);
    await loginPage.goto();
  });

  test('TC_LOGIN_01 - Valid login with standard user', { tag: ['@smoke', '@regression', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Log in with valid credentials', async () => {
      await loginPage.login(env.standardUser, env.password);
    });
    await test.step('Verify list page is displayed', async () => {
      await listPage.expectLoaded();
      await listPage.expectTitle(titles.list);
      await listPage.expectProductCount(6);
    });
    logger.info(`Login verified for ${env.standardUser}, ${titles.list} page displayed`);
  });

  test('TC_LOGIN_02 - Locked out user sees error message', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Log in with locked out user', async () => {
      await loginPage.login(env.lockedOutUser, env.password);
    });
    await test.step('Verify locked out error', async () => {
      await loginPage.expectError(messages.lockedOut);
      await loginPage.expectLoginFormVisible();
    });
    logger.info(`Error verified: ${messages.lockedOut}`);
  });

  test('TC_LOGIN_03 - Invalid username shows error', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Log in with invalid username', async () => {
      await loginPage.login(env.invalidUser, env.password);
    });
    await test.step('Verify credentials error', async () => {
      await loginPage.expectError(messages.invalidCredentials);
      await loginPage.expectLoginFormVisible();
    });
    logger.info(`Error verified: ${messages.invalidCredentials}`);
  });

  test('TC_LOGIN_04 - Invalid password shows error', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Log in with invalid password', async () => {
      await loginPage.login(env.standardUser, env.invalidPassword);
    });
    await test.step('Verify credentials error', async () => {
      await loginPage.expectError(messages.invalidCredentials);
      await loginPage.expectLoginFormVisible();
    });
    logger.info(`Error verified: ${messages.invalidCredentials}`);
  });

  test('TC_LOGIN_05 - Empty username shows error', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Submit with password only', async () => {
      await loginPage.login('', env.password);
    });
    await test.step('Verify username required error', async () => {
      await loginPage.expectError(messages.usernameRequired);
    });
    logger.info(`Error verified: ${messages.usernameRequired}`);
  });

  test('TC_LOGIN_06 - Empty password shows error', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Submit with username only', async () => {
      await loginPage.login(env.standardUser, '');
    });
    await test.step('Verify password required error', async () => {
      await loginPage.expectError(messages.passwordRequired);
    });
    logger.info(`Error verified: ${messages.passwordRequired}`);
  });

  test('TC_LOGIN_07 - Error message can be closed', { tag: ['@regression', '@negative', '@login'] }, async () => {
    logger.info('Test started');
    await test.step('Trigger an error', async () => {
      await loginPage.login(env.invalidUser, env.invalidPassword);
      await loginPage.expectError(messages.invalidCredentials);
    });
    await test.step('Close the error message', async () => {
      await loginPage.closeError();
    });
    await test.step('Verify error is gone', async () => {
      await loginPage.expectNoError();
    });
    logger.info('Error message closed successfully');
  });

  test('TC_LOGIN_08 - Accessing list page without login shows error', { tag: ['@regression', '@negative', '@login'] }, async ({ page }) => {
    logger.info('Test started');
    await test.step('Open list page directly while logged out', async () => {
      await page.goto('/inventory.html');
    });
    await test.step('Verify redirect to login with error', async () => {
      await loginPage.expectLoginFormVisible();
      await loginPage.expectError(messages.notLoggedIn);
    });
    logger.info(`Auth guard verified: ${messages.notLoggedIn}`);
  });
});
