import { expect, test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { products } from '../utils/testData';
import { logger } from '../utils/logger';

test.describe('Product list', () => {
  let listPage: ListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    await listPage.goto();
  });

  test('TC_LIST_01 - List shows all products', { tag: ['@smoke', '@regression', '@list'] }, async () => {
    logger.info('Test started');
    await test.step('Verify product count', async () => {
      await listPage.expectProductCount(products.length);
    });
    await test.step('Verify all product names are displayed', async () => {
      const names = await listPage.getNames();
      expect(names.sort()).toEqual(products.map((p) => p.name).sort());
    });
    logger.info(`List verified, ${products.length} products displayed`);
  });

  for (const [index, product] of products.entries()) {
    test(`TC_LIST_0${index + 2} - ${product.name} shows name, description, price, image and Add to cart button`, { tag: ['@regression', '@list'] }, async () => {
      logger.info('Test started');
      await test.step(`Verify card content for ${product.name}`, async () => {
        await listPage.expectProductCard(product);
      });
      await test.step('Verify product image source', async () => {
        await listPage.expectProductImage(product);
      });
      logger.info(`Card verified: ${product.name}, ${product.priceText}`);
    });
  }
});
