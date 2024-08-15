// @ts-ignore
import * as ChromeLauncher from 'chrome-launcher';
import * as path from 'path';
import { Browser, KnownDevices, PuppeteerLaunchOptions } from 'puppeteer';
import { puppeteerConfig } from './config/config';
import puppeteer from 'puppeteer';

export module BrowserMaker {
  export async function newPage(url: string, browser: Browser, mobile = false) {
    const page = await browser.newPage();
    if (mobile) {
      await page.emulate(KnownDevices['iPhone X']);
    } else {
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
      );
      // await page.setViewport({ width: 1920, height: 1080 });
    }

    await page.goto(url);
    return page;
  }

  export async function makeChrome() {
    const chrome = await ChromeLauncher.launch({
      port: 9222,
      startingUrl: 'https://abrahamjuliot.github.io/creepjs/',
    });
  }

  export async function initBrowser(
    headless = false,
    name?: string,
    extras = {},
  ) {
    // Use stealth
    // const stealth = StealthPlugin();
    // stealth.onBrowser = <any>(() => {});
    // puppeteer.use(stealth);

    // Uncomment to use chrome
    const chromePath = getChrome();
    if (chromePath) {
      extras = { ...extras, executablePath: chromePath };
    } else {
      console.log('Chrome not found, using chromium');
      extras = {};
    }

    let browserOptions: PuppeteerLaunchOptions = {
      headless: headless,
      devtools: false,
      args: [...puppeteerConfig.chroniumArgs],
      defaultViewport: null,
      ...extras,
    };

    // If has session name, use dataDir
    if (name) {
      browserOptions = {
        ...browserOptions,
        ...{
          userDataDir: path.join(
            process.cwd(),
            `sessions/session-${name.toLowerCase()}`,
          ),
        },
      };
    }

    const browser = await puppeteer.launch(browserOptions);
    return browser;
  }

  /**
   * Retrieves chrome instance path
   */
  function getChrome() {
    try {
      const chromeInstalations = ChromeLauncher.Launcher.getInstallations();
      return chromeInstalations[0];
    } catch (error) {
      return undefined;
    }
  }
}
