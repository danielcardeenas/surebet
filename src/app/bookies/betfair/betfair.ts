import { BrowserMaker } from '@browser';
import { BookieName } from '@models';
import { fiats } from '@money/currencies/fiat';
import { Currency } from '@money/types';
import { Browser, Page } from 'puppeteer';
import { Credentials } from '../../models/types/credentials';
import { Bookie } from '../bookie';
import { Login } from './controller/auth';
import { repo } from './repository';

export class Betfair extends Bookie {
  private page: Page;
  public name = BookieName.Betfair;

  /**
   * constructor for a Betfair instnace
   * @param browser Browser instance
   * @param authPage Optional, Already authenticated page
   */
  constructor(init: { browser: Browser }, currency: Currency) {
    super(init.browser, currency);
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
    currency: Currency = fiats.USD,
  ) {
    const browser = await BrowserMaker.initBrowser(config.headless, this.name);
    return new Betfair({ browser }, currency);
  }

  protected async _login(credentials: Credentials): Promise<boolean> {
    const pages = await this.browser.pages();
    const newPage = async () => await this.browser.newPage();
    this.page = pages.length > 0 ? pages[0] : await newPage();

    return new Login(credentials, this.page).do();
  }
}
