import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {
  readonly title: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(protected readonly page: Page) {
    this.title = page.getByTestId('title');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async expectTitle(title: string): Promise<void> {
    await expect(this.title).toHaveText(title);
  }

  async expectCartBadge(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectNoCartBadge(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async resetCartState(): Promise<void> {
    await this.page.evaluate(() => window.localStorage.removeItem('cart-contents'));
    await expect(this.cartBadge).toHaveCount(0);
  }
}
