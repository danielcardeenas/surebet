import { sleep } from '@utils';
import { Browser, Page } from 'puppeteer';

/**
 * Generic page load
 * @param page Puppeteer Page instance
 * @param browser Puppeteer Browser instance
 * @param url url to load
 * @param wait milliseconds before returning page
 * @returns 
 */
export async function loadPage(
  page: Page,
  browser: Browser,
  url: string,
  wait = 5000,
) {
  if (page === undefined) {
    page = await browser.newPage();
  }

  await page.goto(url);
  await sleep(wait);
  return page;
}
