import { expect, Locator, Page } from '@playwright/test';

export class MenuComponent {
  readonly openButton: Locator;
  readonly closeButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.openButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetLink = page.getByTestId('reset-sidebar-link');
  }

  async open(): Promise<void> {
    await this.openButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await expect(this.logoutLink).toBeHidden();
  }

  async expectItems(): Promise<void> {
    await expect(this.allItemsLink).toHaveText('All Items');
    await expect(this.aboutLink).toHaveText('About');
    await expect(this.logoutLink).toHaveText('Logout');
    await expect(this.resetLink).toHaveText('Reset App State');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.resetLink.click();
  }

  async openAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async openAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }
}
