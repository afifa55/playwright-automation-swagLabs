import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { messages, titles, urls } from '../utils/testData';

export class CheckoutCompletePage extends BasePage {
  readonly header: Locator;
  readonly text: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByTestId('complete-header');
    this.text = page.getByTestId('complete-text');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page).toHaveURL(urls.checkoutComplete);
    await expect(this.title).toHaveText(titles.checkoutComplete);
    await expect(this.header).toHaveText(messages.orderThanks);
    await expect(this.text).toHaveText(messages.orderDispatched);
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
