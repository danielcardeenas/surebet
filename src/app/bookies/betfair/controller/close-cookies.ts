import { Page } from 'puppeteer';
import { BetfairController } from './base-controller';

export class CookiesCloser extends BetfairController {
  public static async do(page: Page) {
    try {
      await page.waitForSelector('#onetrust-accept-btn-handler', {
        timeout: 0,
        visible: true,
      });

      // Click
      await page.evaluate(() => {
        (<any>document.querySelector('#onetrust-accept-btn-handler')).click();;
      });
    } catch (err) {
      console.log('No notification detected');
    }
  }
}
