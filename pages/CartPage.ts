import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, titles, urls } from '../utils/testData';

export class CartPage extends BasePage {
  readonly items: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  private item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(urls.cart);
    await expect(this.title).toHaveText(titles.cart);
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async expectItem(product: Product, quantity = 1): Promise<void> {
    const row = this.item(product.name);
    await expect(row).toHaveCount(1);
    await expect(row.getByTestId('inventory-item-name')).toHaveText(product.name);
    await expect(row.getByTestId('inventory-item-desc')).toHaveText(product.description);
    await expect(row.getByTestId('inventory-item-price')).toHaveText(product.priceText);
    await expect(row.getByTestId('item-quantity')).toHaveText(String(quantity));
  }

  async expectItemAbsent(name: string): Promise<void> {
    await expect(this.item(name)).toHaveCount(0);
  }

  async removeItem(name: string): Promise<void> {
    await this.item(name).getByRole('button', { name: 'Remove', exact: true }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
