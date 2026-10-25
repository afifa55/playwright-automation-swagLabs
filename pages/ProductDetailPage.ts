import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Product, urls } from '../utils/testData';

export class ProductDetailPage extends BasePage {
  readonly name: Locator;
  readonly description: Locator;
  readonly price: Locator;
  readonly addButton: Locator;
  readonly removeButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('inventory-item-name');
    this.description = page.getByTestId('inventory-item-desc');
    this.price = page.getByTestId('inventory-item-price');
    this.addButton = page.getByRole('button', { name: 'Add to cart', exact: true });
    this.removeButton = page.getByRole('button', { name: 'Remove', exact: true });
    this.backButton = page.getByTestId('back-to-products');
  }

  async goto(product: Product): Promise<void> {
    await this.page.goto(`/inventory-item.html?id=${product.id}`);
    await this.expectLoaded(product);
  }

  async expectLoaded(product: Product): Promise<void> {
    await expect(this.page).toHaveURL(urls.productDetail(product.id));
    await expect(this.backButton).toBeVisible();
    await expect(this.name).toHaveText(product.name);
  }

  async expectDetails(product: Product): Promise<void> {
    await expect(this.name).toHaveText(product.name);
    await expect(this.description).toHaveText(product.description);
    await expect(this.price).toHaveText(product.priceText);
    await expect(this.page.getByRole('img', { name: product.name, exact: true })).toBeVisible();
  }

  async addToCart(): Promise<void> {
    await expect(this.backButton).toBeVisible();
    await this.addButton.click();
  }

  async removeFromCart(): Promise<void> {
    await expect(this.backButton).toBeVisible();
    await this.removeButton.click();
  }

  async expectInCart(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
    await expect(this.addButton).toHaveCount(0);
  }

  async expectNotInCart(): Promise<void> {
    await expect(this.addButton).toBeVisible();
    await expect(this.removeButton).toHaveCount(0);
  }

  async backToProducts(): Promise<void> {
    await this.backButton.click();
  }
}
