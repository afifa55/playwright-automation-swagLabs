import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { parsePrice, Product, SortOption, titles, urls } from '../utils/testData';

export class ListPage extends BasePage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortSelect: Locator;
  readonly activeSort: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.activeSort = page.getByTestId('active-option');
  }

  private item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  private addButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Add to cart', exact: true });
  }

  private removeButton(name: string): Locator {
    return this.item(name).getByRole('button', { name: 'Remove', exact: true });
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
    await this.expectLoaded();
  }

  async expectLoaded(timeout?: number): Promise<void> {
    await expect(this.page).toHaveURL(urls.list, { timeout });
    await expect(this.title).toHaveText(titles.list, { timeout });
  }

  async expectProductCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  async expectProductCard(product: Product): Promise<void> {
    const card = this.item(product.name);
    await expect(card).toHaveCount(1);
    await expect(card.getByTestId('inventory-item-name')).toHaveText(product.name);
    await expect(card.getByTestId('inventory-item-desc')).toHaveText(product.description);
    await expect(card.getByTestId('inventory-item-price')).toHaveText(product.priceText);
    await expect(card.getByRole('img', { name: product.name })).toBeVisible();
    await expect(this.addButton(product.name)).toBeVisible();
    await expect(this.addButton(product.name)).toBeEnabled();
  }

  async expectProductImage(product: Product): Promise<void> {
    await expect(this.item(product.name).getByRole('img', { name: product.name })).toHaveAttribute('src', product.imageSrc);
  }

  async addToCart(name: string): Promise<void> {
    await this.addButton(name).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.removeButton(name).click();
  }

  async expectInCart(name: string): Promise<void> {
    await expect(this.removeButton(name)).toBeVisible();
    await expect(this.addButton(name)).toHaveCount(0);
  }

  async expectNotInCart(name: string): Promise<void> {
    await expect(this.addButton(name)).toBeVisible();
    await expect(this.removeButton(name)).toHaveCount(0);
  }

  async openProduct(name: string): Promise<void> {
    await this.item(name).getByTestId('inventory-item-name').click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option.value);
    await expect(this.sortSelect).toHaveValue(option.value);
    await expect(this.activeSort).toHaveText(option.label);
  }

  async expectNamesSorted(compare: (a: string, b: string) => number): Promise<void> {
    await expect(this.itemNames.first()).toBeVisible();
    await expect
      .poll(async () => {
        const names = await this.itemNames.allTextContents();
        const sorted = [...names].sort(compare);
        return names.length > 0 && names.every((name, i) => name === sorted[i]);
      })
      .toBe(true);
  }

  async expectPricesSorted(compare: (a: number, b: number) => number): Promise<void> {
    await expect(this.itemPrices.first()).toBeVisible();
    await expect
      .poll(async () => {
        const prices = (await this.itemPrices.allTextContents()).map(parsePrice);
        const sorted = [...prices].sort(compare);
        return prices.length > 0 && prices.every((price, i) => price === sorted[i]);
      })
      .toBe(true);
  }

  async getNames(): Promise<string[]> {
    await expect(this.itemNames.first()).toBeVisible();
    return this.itemNames.allTextContents();
  }

  async getPrices(): Promise<number[]> {
    await expect(this.itemPrices.first()).toBeVisible();
    return (await this.itemPrices.allTextContents()).map(parsePrice);
  }
}
