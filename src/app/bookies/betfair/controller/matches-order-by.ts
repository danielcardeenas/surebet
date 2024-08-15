import { sleep } from '@utils';
import { Page } from 'puppeteer';

export class MatchesLoader {
  /**
   * Orders events
   * @param page
   * @param orderBy
   */
  public static async orderBy(
    orderBy: 'time' | 'matched_amount' = 'matched_amount',
    page: Page,
  ) {
    // Open up selections
    await page.waitForSelector('.coupon-filter-bar bf-select > div > label', {
      visible: true,
    });
    await page.evaluate(() => {
      (<any>(
        document.querySelector('.coupon-filter-bar bf-select > div > label')
      )).click();
    });
    await sleep(400);

    // Select option
    await page.evaluate((orderBy: string) => {
      (<any>(
        document.querySelector(
          `.coupon-filter-bar bf-select > div > .options-list > bf-option[value="${orderBy}"] > span`,
        )
      )).click();;
    }, orderBy);

    await sleep(5000);
  }
}
