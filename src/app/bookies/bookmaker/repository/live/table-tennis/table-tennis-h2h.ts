import { Cleaner, Place, Postulate } from '@bookmaker/controllers';
import { H2HGenetic } from '@genetics';
import { Bet, BetEvent, BookieName, PartialBet } from '@models';
import { randomInt, sleep } from '@utils';
import { createCursor, GhostCursor } from 'ghost-cursor';
import { Browser, ElementHandle, Page } from 'puppeteer';

export class TableTennisH2H {
  private static page: Page;
  private static cursor: GhostCursor;

  /**
   * Main retriever method
   * @param page
   * @param browser
   */
  public static async get(page: Page, browser: Browser) {
    if (!this.page) {
      this.cursor = createCursor(page);
      // Page should already come loaded
      this.page = await this.navigateTo(page, 'TABLE TENNIS', this.cursor);
      this.page.setDefaultTimeout(8000);
    }

    // Get rows
    const _rows = await this.eventRows(this.page);

    // Create events
    const _events = _rows.map(async (_row) => this.createBetEvent(_row));
    const events = await Promise.all(_events);

    return events;
  }

  /**
   * Retrieves each event row as Elements
   * @param page
   */
  private static async eventRows(page: Page) {
    const matchesQuery = 'app-schedule-game-american';

    try {
      await page.waitForSelector(matchesQuery, {
        timeout: 8000,
      });
      return page.$$(matchesQuery);
    } catch (err) {
      console.log(BookieName.Bookmaker, 'No events');
      return [];
    }
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
      // @ts-ignore
      const runners = [
        row.querySelector('.teams .visitor')?.textContent.trim(),
        row.querySelector('.teams .home')?.textContent.trim(),
      ];

      // @ts-ignore
      const buttons = [
        row.querySelector('app-money-line .mline-1'),
        row.querySelector('app-money-line .mline-2'),
      ];

      // Buttons are already ordered
      return buttons.map((button, index) => {
        const odds = +button.textContent?.trim();
        return {
          title: runners[index],
          odds: !!odds ? odds : 0,
        };
      });
    }, row);

    // Already ordered
    const buttons = [
      await row.$('app-money-line .mline-1'),
      await row.$('app-money-line .mline-2'),
    ];

    const bets: Bet[] = _partials.map((partial, index) => {
      const buttonElement = buttons[index];
      return {
        title: partial.title,
        odds: partial.odds,
        element: buttonElement,
        genetic: new H2HGenetic(partial.title),
        place: () =>
          Place.do(this.page, buttonElement, partial.odds, this.cursor),
        clean: () => Cleaner.do(this.page),
        postulate: (amount: number) =>
          Postulate.do(
            this.page,
            buttonElement,
            amount,
            partial.odds,
            this.cursor,
          ),
      };
    });

    // Return event
    return {
      bets: bets,
      bookie: BookieName.Bookmaker,
      title: `${bets[0]?.title} ${bets[1]?.title}`,
    };
  }

  /**
   * Loads tennis matches in the browser
   * @param page
   * @param section ("cat" property)
   * @returns
   */
  private static async navigateTo(
    page: Page,
    section: string,
    cursor: GhostCursor,
  ) {
    const control = await page.waitForSelector(
      `.sports-controls  [cat="${section}"]`,
    );

    await cursor.move(control);
    await control.click({ delay: randomInt(10, 50) });
    await sleep(3000);
    return page;
  }
}
