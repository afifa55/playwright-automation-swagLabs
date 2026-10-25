import { expect, test } from '@playwright/test';
import { ListPage } from '../pages/ListPage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { MenuComponent } from '../pages/MenuComponent';
import { productByKey, urls } from '../utils/testData';
import { logger } from '../utils/logger';

const { backpack, bikeLight } = productByKey;

test.describe('Menu', () => {
  let listPage: ListPage;
  let cartPage: CartPage;
  let detailPage: ProductDetailPage;
  let loginPage: LoginPage;
  let menu: MenuComponent;

  test.beforeEach(async ({ page }) => {
    listPage = new ListPage(page);
    cartPage = new CartPage(page);
    detailPage = new ProductDetailPage(page);
    loginPage = new LoginPage(page);
    menu = new MenuComponent(page);
    await listPage.goto();
    await listPage.resetCartState();
  });

  test('TC_MENU_01 - Menu shows all items and can be closed', { tag: ['@regression', '@menu'] }, async () => {
    logger.info('Test started');
    await test.step('Open menu', async () => {
      await menu.open();
    });
    await test.step('Verify menu items', async () => {
      await menu.expectItems();
    });
    await test.step('Close menu', async () => {
      await menu.close();
    });
    logger.info('Menu items verified: All Items, About, Logout, Reset App State');
  });

  test('TC_MENU_02 - Logout returns to login page', { tag: ['@smoke', '@regression', '@menu'] }, async () => {
    logger.info('Test started');
    await test.step('Open menu and logout', async () => {
      await menu.open();
      await menu.logout();
    });
    await test.step('Verify login page is displayed', async () => {
      await loginPage.expectLoginFormVisible();
    });
    logger.info('Logout verified, login page displayed');
  });

  test('TC_MENU_03 - Reset app state clears the cart', { tag: ['@regression', '@menu', '@cart'] }, async () => {
    logger.info('Test started');
    await test.step('Add items to cart', async () => {
      await listPage.addToCart(backpack.name);
      await listPage.addToCart(bikeLight.name);
      await listPage.expectCartBadge(2);
    });
    await test.step('Reset app state', async () => {
      await menu.open();
      await menu.resetAppState();
    });
    await test.step('Verify cart badge is cleared', async () => {
      await listPage.expectNoCartBadge();
    });
    await test.step('Verify cart page is empty', async () => {
      await listPage.openCart();
      await cartPage.expectItemCount(0);
    });
    logger.info('Reset app state verified, cart is empty');
  });

  test('TC_MENU_04 - About link opens Sauce Labs site', { tag: ['@regression', '@menu'] }, async ({ page }) => {
    logger.info('Test started');
    await test.step('Open menu and click About', async () => {
      await menu.open();
      await menu.openAbout();
    });
    await test.step('Verify Sauce Labs site is opened', async () => {
      await expect(page).toHaveURL(urls.about);
    });
    logger.info(`About link verified, url: ${page.url()}`);
  });

  test('TC_MENU_05 - All items link returns to list', { tag: ['@regression', '@menu'] }, async () => {
    logger.info('Test started');
    await test.step('Open product details page', async () => {
      await detailPage.goto(backpack);
    });
    await test.step('Open menu and click All Items', async () => {
      await menu.open();
      await menu.openAllItems();
    });
    await test.step('Verify list page is displayed', async () => {
      await listPage.expectLoaded();
      await listPage.expectProductCount(6);
    });
    logger.info('All Items link verified, list page displayed');
  });
});
