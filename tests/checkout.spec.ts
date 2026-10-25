import { expect, test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { env } from '../utils/env';
import { formatMoney, messages, productByKey, sumPrices } from '../utils/testData';
import { logger } from '../utils/logger';

const { backpack, bikeLight } = productByKey;

test.describe('Checkout', () => {
  let listPage: ListPage;
  let cartPage: CartPage;
  let infoPage: CheckoutInfoPage;
  let overviewPage: CheckoutOverviewPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    cartPage = new CartPage(page);
    infoPage = new CheckoutInfoPage(page);
    overviewPage = new CheckoutOverviewPage(page);
    completePage = new CheckoutCompletePage(page);
    await listPage.goto();
    await listPage.resetCartState();
    await listPage.addToCart(backpack.name);
    await listPage.expectCartBadge(1);
    await listPage.openCart();
    await cartPage.expectItem(backpack);
    await cartPage.checkout();
    await infoPage.expectLoaded();
  });

  test('TC_CHECKOUT_01 - Complete full checkout flow', { tag: ['@smoke', '@regression', '@e2e', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Fill checkout information', async () => {
      await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
      await infoPage.expectInfo(env.firstName, env.lastName, env.postalCode);
      await infoPage.continue();
    });
    await test.step('Verify order overview', async () => {
      await overviewPage.expectLoaded();
      await overviewPage.expectItemCount(1);
      await overviewPage.expectItem(backpack);
    });
    let total = 0;
    await test.step('Verify item total + tax = total', async () => {
      const itemTotal = await overviewPage.getItemTotal();
      const tax = await overviewPage.getTax();
      total = await overviewPage.getTotal();
      expect(itemTotal).toBeCloseTo(backpack.price, 2);
      expect(itemTotal + tax).toBeCloseTo(total, 2);
    });
    await test.step('Finish the order', async () => {
      await overviewPage.finish();
      await completePage.expectOrderComplete();
      await completePage.expectNoCartBadge();
    });
    logger.info(`Order completed, total: ${formatMoney(total)}`);
  });

  test('TC_CHECKOUT_02 - Multiple items totals are calculated correctly', { tag: ['@regression', '@e2e', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Go back and add a second item', async () => {
      await infoPage.cancel();
      await cartPage.continueShopping();
      await listPage.addToCart(bikeLight.name);
      await listPage.expectCartBadge(2);
      await listPage.openCart();
      await cartPage.expectItemCount(2);
      await cartPage.checkout();
    });
    await test.step('Fill checkout information', async () => {
      await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
      await infoPage.continue();
    });
    await test.step('Verify overview items', async () => {
      await overviewPage.expectLoaded();
      await overviewPage.expectItemCount(2);
      await overviewPage.expectItem(backpack);
      await overviewPage.expectItem(bikeLight);
    });
    let total = 0;
    await test.step('Verify item total + tax = total', async () => {
      const itemTotal = await overviewPage.getItemTotal();
      const tax = await overviewPage.getTax();
      total = await overviewPage.getTotal();
      expect(itemTotal).toBeCloseTo(sumPrices([backpack, bikeLight]), 2);
      expect(itemTotal + tax).toBeCloseTo(total, 2);
    });
    await test.step('Finish the order', async () => {
      await overviewPage.finish();
      await completePage.expectOrderComplete();
    });
    logger.info(`Order completed, total: ${formatMoney(total)}`);
  });

  test('TC_CHECKOUT_03 - First name is required', { tag: ['@regression', '@negative', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Submit without first name', async () => {
      await infoPage.fillInfo('', env.lastName, env.postalCode);
      await infoPage.continue();
    });
    await test.step('Verify error', async () => {
      await infoPage.expectError(messages.firstNameRequired);
      await infoPage.expectLoaded();
    });
    logger.info(`Error verified: ${messages.firstNameRequired}`);
  });

  test('TC_CHECKOUT_04 - Last name is required', { tag: ['@regression', '@negative', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Submit without last name', async () => {
      await infoPage.fillInfo(env.firstName, '', env.postalCode);
      await infoPage.continue();
    });
    await test.step('Verify error', async () => {
      await infoPage.expectError(messages.lastNameRequired);
      await infoPage.expectLoaded();
    });
    logger.info(`Error verified: ${messages.lastNameRequired}`);
  });

  test('TC_CHECKOUT_05 - Postal code is required', { tag: ['@regression', '@negative', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Submit without postal code', async () => {
      await infoPage.fillInfo(env.firstName, env.lastName, '');
      await infoPage.continue();
    });
    await test.step('Verify error', async () => {
      await infoPage.expectError(messages.postalCodeRequired);
      await infoPage.expectLoaded();
    });
    logger.info(`Error verified: ${messages.postalCodeRequired}`);
  });

  test('TC_CHECKOUT_06 - Cancel on information step returns to cart', { tag: ['@regression', '@negative', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Cancel on information step', async () => {
      await infoPage.cancel();
    });
    await test.step('Verify cart page with item kept', async () => {
      await cartPage.expectLoaded();
      await cartPage.expectItem(backpack);
      await cartPage.expectCartBadge(1);
    });
    logger.info('Cancel on information step returned to cart, badge count 1');
  });

  test('TC_CHECKOUT_07 - Cancel on overview step returns to list', { tag: ['@regression', '@negative', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Reach overview step', async () => {
      await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
      await infoPage.continue();
      await overviewPage.expectLoaded();
    });
    await test.step('Cancel on overview step', async () => {
      await overviewPage.cancel();
    });
    await test.step('Verify list page with item kept', async () => {
      await listPage.expectLoaded();
      await listPage.expectInCart(backpack.name);
      await listPage.expectCartBadge(1);
    });
    logger.info('Cancel on overview step returned to list, badge count 1');
  });

  test('TC_CHECKOUT_08 - Back home after order clears the cart', { tag: ['@regression', '@e2e', '@checkout'] }, async () => {
    logger.info('Test started');
    await test.step('Complete the order', async () => {
      await infoPage.fillInfo(env.firstName, env.lastName, env.postalCode);
      await infoPage.continue();
      await overviewPage.expectLoaded();
      await overviewPage.finish();
      await completePage.expectOrderComplete();
    });
    await test.step('Go back home', async () => {
      await completePage.backHome();
      await listPage.expectLoaded();
    });
    await test.step('Verify cart is empty', async () => {
      await listPage.expectNoCartBadge();
      await listPage.expectNotInCart(backpack.name);
    });
    logger.info('Order completed, cart cleared');
  });
});
