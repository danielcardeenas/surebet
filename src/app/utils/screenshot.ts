import { Page } from 'puppeteer';

export async function screenshot(page: Page, path: string) {
  await page.screenshot({
    path: path,
  });
  console.info(`Screnshot: ${path}`);
}
