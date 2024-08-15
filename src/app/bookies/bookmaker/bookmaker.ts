import { BrowserMaker } from '@browser';
import { BookieName } from '@models';
import { fiats } from '@money/currencies/fiat';
import { Currency } from '@money/types';
import { Browser, Page } from 'puppeteer';
import { Credentials } from '../../models/types/credentials';
import { Bookie } from '../bookie';
import { Login } from './controllers';
import { repo } from './repository';
import * as puppeteer from 'puppeteer';
import { pollUntil } from '@utils';

const INITIAL_URL = 'https://be.bookmaker.eu/';

/**
 * Bookmaker.eu
 * 
 * Important: Lang inside the bookie must be in english 
 * for correct bet placing detection
 */
export class Bookmaker extends Bookie {
  private page: Page;
  public name = BookieName.Bookmaker;

  /**
   * constructor for a Bookmaker instnace
   * @param browser Browser instance
   * @param authPage Optional, Already authenticated page
   */
  constructor(init: { browser: Browser; page?: Page }, currency: Currency) {
    super(init.browser, currency);
    this.page = init.page;
  }

  /**
   * Repository
   */
  public _repo = () => repo(this.page, this.browser);

  /**
   * Creates native puppeteer instance (Used in constructor)
   */
  public static async instance(
    config: { headless: boolean },
    currency: Currency = fiats.MXN,
  ) {
    const port = 9222;
    console.log(
      `${BookieName.Bookmaker} is gonna connect to your current Chrome instance.`,
    );
    console.log(
      `Make sure you have chrome running with param: \n\t--remote-debugging-port=${port}`,
    );

    const browserURL = `http://127.0.0.1:${port}`;
    const browser = await puppeteer.connect({
      browserURL,
      defaultViewport: null,
    });

    console.log(
      `${BookieName.Bookmaker} waiting/searching for bookmker.com page manually opened.`,
    );
    const page = await pollUntil(async () => {
      const pages = await browser.pages();
      const page = pages.find((page) => page.url().includes('bookmaker.eu'));
      if (page) {
        return page;
      }

      return null;
    }, 1000);
    
    console.log(`${BookieName.Bookmaker} Connected to page (${page.url()}).`);
    // await page.goto(`${browserURL}/json/version?sportsbook=${this.name}`);
    return new Bookmaker({ browser, page }, currency);

    // const browser = await BrowserMaker.initBrowser(config.headless, this.name);
    // const pages = await browser.pages();
    // const newPage = async () => await browser.newPage();
    // const page = pages.length > 0 ? pages[0] : await newPage();
    // await page.goto(INITIAL_URL);
    // return new Bookmaker({ browser, page }, currency);
  }

  protected async _login(credentials: Credentials): Promise<boolean> {
    return new Login(credentials, this.page).do();
  }
}
