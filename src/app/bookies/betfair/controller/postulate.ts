import { PostulateResult } from '@models';
import { ElementHandle, Page } from 'puppeteer';
import { BetfairController } from './base-controller';

export class Postulate extends BetfairController {
  public static async do(
    page: Page,
    element: ElementHandle<Element>,
    amount: number,
    knownOdds: number,
  ): Promise<PostulateResult> {
    await element.click();

    const givenOdds = await page.evaluate((element: Element) => {
      // @ts-ignore
      const odds = document.querySelector('.price-container input')?.value
      return !!odds ? +odds : 0;
    }, element);

    const stakeInput = await page.waitForSelector('.bet-actions-container .size-input', {
      timeout: 6000,
    });
    
    await stakeInput.focus();
    await stakeInput.type(amount.toString(), { delay: 100 });

    return {
      valid: true,
      odds: givenOdds,
      reason: null,
    };
  }
}
