import { test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { productByKey } from '../utils/testData';
import { logger } from '../utils/logger';

const product = productByKey.backpack;

test.describe('Product details', () => {
  let listPage: ListPage;
  let detailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    detailPage = new ProductDetailPage(page);
    await listPage.goto();
    await listPage.resetCartState();
    await listPage.expectNoCartBadge();
  });

  test('TC_PRODUCT_01 - Open product and verify details match the list', { tag: ['@smoke', '@regression', '@product'] }, async () => {
    logger.info('Test started');
    await test.step('Verify list card', async () => {
      await listPage.expectProductCard(product);
    });
    await test.step('Open product details', async () => {
      await listPage.openProduct(product.name);
      await detailPage.expectLoaded(product);
    });
    await test.step('Verify details match the list', async () => {
      await detailPage.expectDetails(product);
      await detailPage.expectNotInCart();
    });
    logger.info(`Details verified: ${product.name}, ${product.priceText}`);
  });

  test('TC_PRODUCT_02 - Add and remove product from detail page', { tag: ['@regression', '@product', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Open product details', async () => {
      await listPage.openProduct(product.name);
      await detailPage.expectLoaded(product);
    });
    await test.step('Add to cart', async () => {
      await detailPage.addToCart();
      await detailPage.expectInCart();
      await detailPage.expectCartBadge(1);
    });
    await test.step('Remove from cart', async () => {
      await detailPage.removeFromCart();
      await detailPage.expectNotInCart();
      await detailPage.expectNoCartBadge();
    });
    logger.info(`Add/remove verified on detail page for ${product.name}`);
  });

  test('TC_PRODUCT_03 - Back to products keeps cart state', { tag: ['@regression', '@product'] }, async () => {
    logger.info('Test started');
    await test.step('Open product and add to cart', async () => {
      await listPage.openProduct(product.name);
      await detailPage.addToCart();
      await detailPage.expectCartBadge(1);
    });
    await test.step('Go back to products', async () => {
      await detailPage.backToProducts();
      await listPage.expectLoaded();
    });
    await test.step('Verify list reflects cart state', async () => {
      await listPage.expectInCart(product.name);
      await listPage.expectCartBadge(1);
    });
    logger.info('Back to products verified, badge count: 1');
  });

  test('TC_PRODUCT_04 - Product added on list shows Remove on detail page', { tag: ['@regression', '@product'] }, async () => {
    logger.info('Test started');
    await test.step('Add to cart from list', async () => {
      await listPage.addToCart(product.name);
      await listPage.expectInCart(product.name);
    });
    await test.step('Open product details', async () => {
      await listPage.openProduct(product.name);
      await detailPage.expectLoaded(product);
    });
    await test.step('Verify Remove button is shown', async () => {
      await detailPage.expectInCart();
      await detailPage.expectCartBadge(1);
    });
    logger.info('Cart state carried over to detail page');
  });
});
