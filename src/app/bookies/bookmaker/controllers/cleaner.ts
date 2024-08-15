import { BookieName } from '@models';
import { randomInt, sleep } from '@utils';
import { Page } from 'puppeteer';

export class Cleaner {
  public static async do(page: Page) {
    try {
      const closeButtons = await page.$$('.betslip-container .remove-bet');
      for (const _ of closeButtons) {
        const closeButton = await page.$('.betslip-container .remove-bet');
        await closeButton.click({ delay: randomInt(1, 50) });
        await sleep(1000);
      }

      return true;
    } catch (error) {
      console.log(`Failed to clean ${BookieName.Betcris} betslip`);
      return false;
    }
  }
}
