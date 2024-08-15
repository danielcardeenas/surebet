import { randomInt } from '@utils';
import { Page } from 'puppeteer';
import { BetfairController } from './base-controller';

export class Cleaner extends BetfairController {
  public static async do(page: Page) {
    try {
      const _cancel = await page.waitForSelector('.reset-bet', {
        timeout: 1000,
      });
      await _cancel.click();
      return true;
    } catch (error) {
      console.log(`Failed to clean on ${this.bookie}`);
      return false;
    }
  }
}
