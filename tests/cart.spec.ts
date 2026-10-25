import { test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { CartPage } from '../pages/CartPage';
import { productByKey } from '../utils/testData';
import { logger } from '../utils/logger';

const { backpack, bikeLight, boltShirt } = productByKey;

test.describe('Cart', () => {
  let listPage: ListPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    cartPage = new CartPage(page);
    await listPage.goto();
    await listPage.resetCartState();
    await listPage.expectNoCartBadge();
  });

  test('TC_CART_01 - Add a single item to cart', { tag: ['@smoke', '@regression', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add item from list', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.expectInCart(backpack.name);
      await listPage.expectCartBadge(1);
    });
    await test.step('Open cart and verify item', async () => {
      await listPage.openCart();
      await cartPage.expectLoaded();
      await cartPage.expectItemCount(1);
      await cartPage.expectItem(backpack);
    });
    logger.info(`Cart verified: 1 item, ${backpack.name} at ${backpack.priceText}`);
  });

  test('TC_CART_02 - Add multiple items and badge count updates', { tag: ['@smoke', '@regression', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add first item', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.expectInCart(backpack.name);
      await listPage.expectCartBadge(1);
    });
    await test.step('Add second item', async () => {
      await listPage.addToCart(bikeLight.name);
      await listPage.expectInCart(bikeLight.name);
      await listPage.expectCartBadge(2);
    });
    await test.step('Add third item', async () => {
      await listPage.addToCart(boltShirt.name);
      await listPage.expectInCart(boltShirt.name);
      await listPage.expectCartBadge(3);
    });
    await test.step('Open cart and verify all items', async () => {
      await listPage.openCart();
      await cartPage.expectItemCount(3);
      await cartPage.expectItem(backpack);
      await cartPage.expectItem(bikeLight);
      await cartPage.expectItem(boltShirt);
    });
    logger.info('Cart verified: 3 items, badge count 3');
  });

  test('TC_CART_03 - Remove item from list page', { tag: ['@regression', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add two items', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.addToCart(bikeLight.name);
      await listPage.expectCartBadge(2);
    });
    await test.step('Remove one item from list', async () => {
      await listPage.removeFromCart(backpack.name);
      await listPage.expectNotInCart(backpack.name);
      await listPage.expectInCart(bikeLight.name);
      await listPage.expectCartBadge(1);
    });
    await test.step('Remove last item from list', async () => {
      await listPage.removeFromCart(bikeLight.name);
      await listPage.expectNotInCart(bikeLight.name);
      await listPage.expectNoCartBadge();
    });
    logger.info('Items removed from list page, cart empty');
  });

  test('TC_CART_04 - Remove item from cart page', { tag: ['@regression', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add two items and open cart', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.addToCart(bikeLight.name);
      await listPage.expectCartBadge(2);
      await listPage.openCart();
      await cartPage.expectItemCount(2);
    });
    await test.step('Remove one item on cart page', async () => {
      await cartPage.removeItem(backpack.name);
      await cartPage.expectItemAbsent(backpack.name);
      await cartPage.expectItemCount(1);
      await cartPage.expectCartBadge(1);
    });
    await test.step('Remove last item on cart page', async () => {
      await cartPage.removeItem(bikeLight.name);
      await cartPage.expectItemCount(0);
      await cartPage.expectNoCartBadge();
    });
    logger.info('Items removed from cart page, cart empty');
  });

  test('TC_CART_05 - Continue shopping returns to list', { tag: ['@regression', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add item and open cart', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.openCart();
      await cartPage.expectLoaded();
    });
    await test.step('Continue shopping', async () => {
      await cartPage.continueShopping();
      await listPage.expectLoaded();
    });
    await test.step('Verify cart state is kept', async () => {
      await listPage.expectInCart(backpack.name);
      await listPage.expectCartBadge(1);
    });
    logger.info('Continue shopping verified, badge count 1');
  });

  test('TC_CART_06 - Items persist in cart after reload', { tag: ['@regression', '@cart'] }, async ({ page }) => {
    logger.info('Test started');
    await test.step('Add items', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.addToCart(bikeLight.name);
      await listPage.expectCartBadge(2);
    });
    await test.step('Reload the page', async () => {
      await page.reload();
      await listPage.expectLoaded();
    });
    await test.step('Verify items persist on list and in cart', async () => {
      await listPage.expectCartBadge(2);
      await listPage.expectInCart(backpack.name);
      await listPage.expectInCart(bikeLight.name);
      await listPage.openCart();
      await cartPage.expectItemCount(2);
      await cartPage.expectItem(backpack);
      await cartPage.expectItem(bikeLight);
    });
    logger.info('Cart persisted after reload: 2 items');
  });

  test('TC_CART_07 - Empty cart shows no items', { tag: ['@regression', '@negative', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Open empty cart', async () => {
      await cartPage.goto();
    });
    await test.step('Verify cart is empty', async () => {
      await cartPage.expectItemCount(0);
      await cartPage.expectNoCartBadge();
    });
    logger.info('Empty cart verified');
  });
});
