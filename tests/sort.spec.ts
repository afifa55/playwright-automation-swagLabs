import { test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { sortOptions } from '../utils/testData';
import { logger } from '../utils/logger';

test.describe('Product sorting', () => {
  let listPage: ListPage;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    await listPage.goto();
  });

  test('TC_SORT_01 - Sort by name A to Z', { tag: ['@smoke', '@regression', '@list', '@sort'] }, async () => {
    logger.info('Test started');
    await test.step('Switch to Z to A first so the change is observable', async () => {
      await listPage.sortBy(sortOptions.nameDesc);
    });
    await test.step('Sort by name A to Z', async () => {
      await listPage.sortBy(sortOptions.nameAsc);
    });
    await test.step('Verify names are in ascending order', async () => {
      await listPage.expectNamesSorted((a, b) => a.localeCompare(b));
    });
    logger.info(`Sorted A-Z: ${(await listPage.getNames()).join(', ')}`);
  });

  test('TC_SORT_02 - Sort by name Z to A', { tag: ['@regression', '@list', '@sort'] }, async () => {
    logger.info('Test started');
    await test.step('Sort by name Z to A', async () => {
      await listPage.sortBy(sortOptions.nameDesc);
    });
    await test.step('Verify names are in descending order', async () => {
      await listPage.expectNamesSorted((a, b) => b.localeCompare(a));
    });
    logger.info(`Sorted Z-A: ${(await listPage.getNames()).join(', ')}`);
  });

  test('TC_SORT_03 - Sort by price low to high', { tag: ['@smoke', '@regression', '@list', '@sort'] }, async () => {
    logger.info('Test started');
    await test.step('Sort by price low to high', async () => {
      await listPage.sortBy(sortOptions.priceAsc);
    });
    await test.step('Verify prices are in ascending order', async () => {
      await listPage.expectPricesSorted((a, b) => a - b);
    });
    logger.info(`Sorted low-high: ${(await listPage.getPrices()).join(', ')}`);
  });

  test('TC_SORT_04 - Sort by price high to low', { tag: ['@regression', '@list', '@sort'] }, async () => {
    logger.info('Test started');
    await test.step('Sort by price high to low', async () => {
      await listPage.sortBy(sortOptions.priceDesc);
    });
    await test.step('Verify prices are in descending order', async () => {
      await listPage.expectPricesSorted((a, b) => b - a);
    });
    logger.info(`Sorted high-low: ${(await listPage.getPrices()).join(', ')}`);
  });
});
