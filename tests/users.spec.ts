import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ListPage } from '../pages/ListPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { env } from '../utils/env';
import { productByKey, products, sortOptions } from '../utils/testData';
import { logger } from '../utils/logger';

test.use({ storageState: { cookies: [], origins: [] } });

const { backpack, boltShirt, fleeceJacket } = productByKey;

test.describe('Special users', () => {
  let loginPage: LoginPage;
  let listPage: ListPage;
  let cartPage: CartPage;
  let infoPage: CheckoutInfoPage;
  let overviewPage: CheckoutOverviewPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    listPage = new ListPage(page);
    cartPage = new CartPage(page);
    infoPage = new CheckoutInfoPage(page);
    overviewPage = new CheckoutOverviewPage(page);
    completePage = new CheckoutCompletePage(page);
    await loginPage.goto();
  });

  test.describe('problem_user', () => {
    test.beforeEach(async () => {
      await loginPage.login(env.problemUser, env.password);
      await listPage.expectLoaded();
    });

    test('TC_USER_01 - Problem user can log in and sees all products', { tag: ['@regression', '@users', '@list'] }, async () => {
      logger.info('Test started');
      await test.step('Verify list page content', async () => {
        await listPage.expectProductCount(products.length);
      });
      logger.info(`Login verified for ${env.problemUser}, ${products.length} products displayed`);
    });

    test('TC_USER_02 - Problem user sees correct product images', { tag: ['@regression', '@users', '@list', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: problem_user sees the same placeholder image for every product');
      logger.warn('Known bug expected: wrong product images');
      await test.step('Verify image of each product', async () => {
        for (const product of products) {
          await listPage.expectProductImage(product);
        }
      });
    });

    test('TC_USER_03 - Problem user can add Bolt T-Shirt to cart', { tag: ['@regression', '@users', '@cart', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: Add to cart does not work for some products with problem_user');
      logger.warn('Known bug expected: add to cart broken for some products');
      await test.step('Add Bolt T-Shirt to cart', async () => {
        await listPage.addToCart(boltShirt.name);
      });
      await test.step('Verify item is in cart', async () => {
        await listPage.expectInCart(boltShirt.name);
        await listPage.expectCartBadge(1);
      });
    });

    test('TC_USER_04 - Problem user can sort by name Z to A', { tag: ['@regression', '@users', '@sort', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: sorting does not work for problem_user');
      logger.warn('Known bug expected: sorting broken');
      await test.step('Sort by name Z to A', async () => {
        await listPage.sortBy(sortOptions.nameDesc);
      });
      await test.step('Verify names are in descending order', async () => {
        await listPage.expectNamesSorted((a, b) => b.localeCompare(a));
      });
    });

    test('TC_USER_05 - Problem user can complete checkout information', { tag: ['@regression', '@users', '@checkout', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: last name field is not editable for problem_user');
      logger.warn('Known bug expected: last name cannot be entered');
      await test.step('Add item and start checkout', async () => {
        await listPage.addToCart(backpack.name);
        await listPage.expectInCart(backpack.name);
        await listPage.openCart();
        await cartPage.checkout();
        await infoPage.expectLoaded();
      });
      await test.step('Fill checkout information', async () => {
        await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
        await infoPage.expectInfo(env.firstName, env.lastName, env.postalCode);
      });
    });
  });

  test.describe('error_user', () => {
    test.beforeEach(async () => {
      await loginPage.login(env.errorUser, env.password);
      await listPage.expectLoaded();
    });

    test('TC_USER_06 - Error user can add Backpack to cart', { tag: ['@regression', '@users', '@cart'] }, async () => {
      logger.info('Test started');
      await test.step('Add Backpack to cart', async () => {
        await listPage.addToCart(backpack.name);
      });
      await test.step('Verify item is in cart', async () => {
        await listPage.expectInCart(backpack.name);
        await listPage.expectCartBadge(1);
      });
      logger.info(`Add to cart verified for ${env.errorUser}: ${backpack.name}`);
    });

    test('TC_USER_07 - Error user can add Fleece Jacket to cart', { tag: ['@regression', '@users', '@cart', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: Add to cart does not work for some products with error_user');
      logger.warn('Known bug expected: add to cart broken for some products');
      await test.step('Add Fleece Jacket to cart', async () => {
        await listPage.addToCart(fleeceJacket.name);
      });
      await test.step('Verify item is in cart', async () => {
        await listPage.expectInCart(fleeceJacket.name);
        await listPage.expectCartBadge(1);
      });
    });

    test('TC_USER_08 - Error user can sort by name Z to A', { tag: ['@regression', '@users', '@sort', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: sorting does not work for error_user');
      logger.warn('Known bug expected: sorting broken');
      await test.step('Sort by name Z to A', async () => {
        await listPage.sortBy(sortOptions.nameDesc);
      });
      await test.step('Verify names are in descending order', async () => {
        await listPage.expectNamesSorted((a, b) => b.localeCompare(a));
      });
    });

    test('TC_USER_09 - Error user can finish an order', { tag: ['@regression', '@users', '@checkout', '@known-bug'] }, async () => {
      test.fail(true, 'Known site bug: Finish does not complete the order for error_user');
      logger.warn('Known bug expected: finish does not complete the order');
      await test.step('Add item and reach overview', async () => {
        await listPage.addToCart(backpack.name);
        await listPage.expectInCart(backpack.name);
        await listPage.openCart();
        await cartPage.checkout();
        await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
        await infoPage.continue();
        await overviewPage.expectLoaded();
      });
      await test.step('Finish the order', async () => {
        await overviewPage.finish();
        await completePage.expectOrderComplete();
      });
    });
  });

  test.describe('performance_glitch_user', () => {
    test('TC_USER_10 - Performance glitch user can log in despite slow response', { tag: ['@regression', '@users', '@login'] }, async () => {
      test.setTimeout(90_000);
      logger.info('Test started');
      await test.step('Log in with performance glitch user', async () => {
        await loginPage.login(env.performanceGlitchUser, env.password);
      });
      await test.step('Verify list page is displayed within extended timeout', async () => {
        await listPage.expectLoaded(45_000);
        await listPage.expectProductCount(products.length);
      });
      logger.info(`Login verified for ${env.performanceGlitchUser}, ${products.length} products displayed`);
    });
  });
});
