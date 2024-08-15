import { PlaceResponse } from '@betcris/models';
import { BookieName } from '@models';
import { genId, randomInt, screenshot, waitForResponse } from '@utils';
import { GhostCursor } from 'ghost-cursor';
import { ElementHandle, Page } from 'puppeteer';

export class Place {
  public static async do(
    page: Page,
    betElement: ElementHandle<Element>,
    knownOdds: number,
    cursor: GhostCursor,
  ): Promise<boolean> {
    try {
      const placeButton = await this.getPlaceButton(page);
      await cursor.move(placeButton);
      placeButton.click({ delay: randomInt(10, 20) });
    } catch (err) {
      // Unable to place bet
      return false;
    }

    const { placed, response } = await this.isPlacedUI(page);
    await page
      .waitForSelector('.betslip-container .message', { timeout: 10000 })
      .catch((err) => null);
    const messages = await page
      .$$eval('.betslip-container .message', (elements) => {
        // @ts-ignore
        return [...elements].map((el) => el.textContent.trim());
      })
      .catch((err) => {
        console.log(`${BookieName.Bookmaker}: No placing messages`);
        return [];
      });

    if (messages.length) {
      console.log(`${BookieName.Bookmaker} place messages:`, messages);
    }

    const confirmed = messages.some(
      (message) => message.indexOf('accepted') > -1,
    );

    if (confirmed || placed) {
      console.log(`${BookieName.Bookmaker}: Bet placed ✅`);
    } else {
      console.log(`${BookieName.Bookmaker}: Bet not placed ❌`);
      console.log(response);
      await screenshot(
        page,
        `screenshots/${BookieName.Bookmaker}_${genId()}_place_error.png`,
      );
    }

    return confirmed;
  }

  /**
   * Retrieves place button (✔️)
   * @param page
   */
  private static getPlaceButton(page: Page) {
    return page.waitForSelector(
      '.betslip-container .place-bet-container button',
      {
        timeout: 2000,
      },
    );
  }

  private static async isPlacedUI(page: Page) {
    const el = await page
      .waitForSelector('betslip-container app-bet-straights-live p', {
        timeout: 10000,
      })
      .catch(() => null);

    if (el) {
      const text = await page.$eval(
        'betslip-container app-bet-straights-live p',
        (el) => el.textContent,
      );

      return {
        placed: text.includes('accepted'),
        response: text,
      };
    }

    return {
      placed: false,
      response: null,
    };
  }

  /**
   * Checks place api result and defines if the bet has been placed
   * @param page
   */
  private static async isPlaced(page: Page) {
    // Listen to place result
    const { response, statusCode } = await waitForResponse<PlaceResponse>(
      page,
      '/SendBets',
    );

    if (response.ErrorMessage) {
      console.log(`${BookieName.Bookmaker}: Error:`, response.ErrorMessage);
    } else {
      console.log(
        `${BookieName.Bookmaker}: Please check manually if the bet has been placed correctly`,
      );
    }

    if (statusCode === 200) {
      // Return right away
      return {
        placed: !response.ErrorMessage,
        response: response,
      };
    } else {
      return {
        placed: false,
        response: response,
      };
    }
  }
}
