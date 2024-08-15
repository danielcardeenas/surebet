import {
  Cleaner,
  CookiesCloser,
  MatchesLoader,
  Place,
  Postulate,
} from '@betfair/controller';
import { H2HGenetic } from '@genetics';
import { Bet, BetEvent, BookieName, ExchangeType, PartialBet } from '@models';
import { sleep } from '@utils';
import { Browser, ElementHandle, Page } from 'puppeteer';

const BASKETBALL_URL =
  'https://www.betfair.com/exchange/plus/es/baloncesto-apuestas-7522';

/**
 * Basketball h2h retriever for Betfair
 */
export class BasketballH2H {
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
      await MatchesLoader.orderBy('matched_amount', this.mainPage);
      this.mainPage.setDefaultTimeout(8000);
    }

    const _rows = await this.eventRows(this.mainPage);

    // Create events
    const _events = _rows.map(async (_row) => this.createBetEvent(_row));
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
   * Loads basketball matches in the browser
   * @param page
   * @param browser
   */
  private static async loadPage(page: Page, browser: Browser) {
    if (page === undefined) {
      page = await browser.newPage();
    }

    await page.goto(BASKETBALL_URL);
    await sleep(5000);
    return page;
  }

  /**
   * Retrieves each event row as Elements
   * @param page
   */
  private static async eventRows(page: Page) {
    // return page.$$('bf-coupon-table tbody tr.ng-scope');
    return page.$$(
      'bf-coupon-table:nth-child(1) table tbody tr:not(.coupon-table-loading)',
    );
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
        row.querySelectorAll('.coupon-runners > *').length >= 3;

      if (isDisabled) {
        return null;
      }

      // @ts-ignore
      const runners = [...row.querySelectorAll('.runners li')].map(
        (r) => r?.textContent,
      );

      // @ts-ignore
      const buttons = [
        ...row.querySelectorAll('.coupon-runners > div > button'),
      ];

      return buttons.map((button, index) => {
        const type = button.getAttribute('type');
        const odds = button.getAttribute('price');
        return {
          title: index <= 1 ? runners[0] : runners[1],
          odds: +odds,
          exchangeType: type as ExchangeType,
        };
      });
    }, row);

    if (_partials === null) {
      return null;
    }

    const buttons = await row.$$('.coupon-runners > div > button');
    const bets: Bet[] = _partials.map((partial, index) => {
      const buttonElement = buttons[index];
      return {
        title: partial.title,
        odds: partial.odds,
        element: buttonElement,
        genetic: new H2HGenetic(partial.title),
        exchangeType: partial.exchangeType,
        place: () => Place.do(this.mainPage, buttonElement, partial.odds),
        clean: () => Cleaner.do(this.mainPage),
        postulate: (amount: number) =>
          Postulate.do(this.mainPage, buttonElement, amount, partial.odds),
      };
    });

    // Return event
    if (bets[0] && bets[2]) {
      return {
        bets: bets,
        bookie: BookieName.Betfair,
        title: `${bets[0].title} ${bets[2].title}`,
      };
    } else {
      return null;
    }
  }
}
