import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice, Product, titles, urls } from '../utils/testData';

export class CheckoutOverviewPage extends BasePage {
  readonly items: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(urls.checkoutOverview);
    await expect(this.title).toHaveText(titles.checkoutOverview);
  }

  async expectItem(product: Product): Promise<void> {
    const row = this.items.filter({ hasText: product.name });
    await expect(row).toHaveCount(1);
    await expect(row.getByTestId('inventory-item-price')).toHaveText(product.priceText);
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  private async amount(label: Locator): Promise<number> {
    await expect(label).toBeVisible();
    return parsePrice(await label.innerText());
  }

  async getItemTotal(): Promise<number> {
    return this.amount(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.amount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.amount(this.totalLabel);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
