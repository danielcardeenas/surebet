import {
  Cleaner,
  CookiesCloser,
  MatchesLoader,
  Place,
  Postulate,
} from '@betfair/controller';
import { ThreeWay } from '@genetics';
import { Bet, BetEvent, BookieName, ExchangeType, PartialBet } from '@models';
import { sleep } from '@utils';
import { Browser, ElementHandle, Page } from 'puppeteer';

const SOCCER_URL =
  'https://www.betfair.com/exchange/plus/es/f%C3%BAtbol-apuestas-1';

/**
 * Tennis h2h retriever for Betfair
 */
export class Soccer1x2 {
  constructor() {}

  private static mainPage: Page;

  /**
   * Main retriever method
   * @param page
   * @param browser
   */
  public static async get(
    browser: Browser,
    page?: Page,
    options?: { include: ExchangeType[] },
  ) {
    if (!this.mainPage) {
      this.mainPage = await this.loadPage(page, browser);
      CookiesCloser.do(this.mainPage);
      await MatchesLoader.orderBy('time', this.mainPage);
      this.mainPage.setDefaultTimeout(8000);
    }

    const _rows = await this.eventRows(this.mainPage);

    // Create events
    const _events = _rows.map((_row) => this.createBetEvent(_row));
    const events = await Promise.all(_events);

    // Return events with given options
    return events
      .filter((event) => !!event)
      .map((event) => {
        if (options?.include) {
          // Include only specified bet exchange types
          const _bets = event?.bets.filter((bet) =>
            options.include.includes(bet.exchangeType),
          );
          const _event = { ...event, bets: _bets };
          return _event;
        } else {
          return event;
        }
      });
  }

  /**
   * Loads tennis matches in the browser
   * @param page
   * @param browser
   */
  private static async loadPage(page: Page, browser: Browser) {
    if (page === undefined) {
      page = await browser.newPage();
    }

    await page.goto(SOCCER_URL);
    await sleep(5000);
    return page;
  }

  /**
   * Retrieves each event row as Elements
   * @param page
   */
  private static async eventRows(page: Page) {
    // return page.$$('bf-coupon-table tbody tr.ng-scope');
    return page.$$('bf-coupon-table table tbody tr:not(.coupon-table-loading)');
  }

  /**
   * Creates a BetEvent from given event row element
   * @param row
   * @param page
   */
  private static async createBetEvent(
    row: ElementHandle<Element>,
  ): Promise<BetEvent> {
    const _partials: PartialBet[] = await row.evaluate((row: Element) => {
      const isDisabled =
        row.querySelectorAll('.coupon-runners > *').length >= 4;

      if (isDisabled) {
        return null;
      }

      const partials: {
        title: string;
        odds: number;
        exchangeType: ExchangeType;
      }[] = [];

      // Team names (2)
      // @ts-ignore
      const runners = [...row.querySelectorAll('.runners li')].map(
        (r) => r?.textContent,
      );

      // 1st iteration: Home team
      // 2nd iteration: Draw
      // 3rd iteration: Away team
      // @ts-ignore
      [...Array(3).keys()].forEach((i) => {
        // @ts-ignore
        const buttons = [
          ...row.querySelectorAll(
            `.coupon-runners > div:nth-child(${i + 1}) > button`,
          ),
        ];

        const _bets = buttons.map((button) => {
          const type = button.getAttribute('type');
          const odds = button.getAttribute('price');
          const title = i === 0 ? runners[0] : i === 1 ? 'Draw' : runners[1];
          return {
            title: title,
            odds: +odds,
            exchangeType: type as ExchangeType,
          };
        });

        // Add bets
        partials.push(..._bets);
      });

      return partials;
    }, row);

    // Disabled row
    if (_partials === null) {
      return null;
    }

    const buttons = await row.$$(`.coupon-runners > div > button`);
    const bets: Bet[] = _partials.map((partial, i) => {
      const buttonElement = buttons[i];
      return {
        title: partial.title,
        odds: partial.odds,
        element: buttonElement,
        genetic: new ThreeWay(partial.title),
        exchangeType: partial.exchangeType,
        place: () => Place.do(this.mainPage, buttonElement, partial.odds),
        clean: () => Cleaner.do(this.mainPage),
        postulate: (amount: number) =>
          Postulate.do(this.mainPage, buttonElement, amount, partial.odds),
      };
    });

    // Return event
    if (bets[0] && bets[4]) {
      return {
        bets: bets,
        bookie: BookieName.Betfair,
        title: `${bets[0].title} ${bets[4].title}`,
      };
    } else {
      return null;
    }
  }
}
