import { PostulateResponse } from '@bookmaker/models';
import { BookieName, PostulateResult } from '@models';
import { jsonable, randomInt, waitForResponse } from '@utils';
import { GhostCursor } from 'ghost-cursor';
import { ElementHandle, Page } from 'puppeteer';
import { firstValueFrom, from } from 'rxjs';
import { timeout } from 'rxjs/operators';

export class Postulate {
  public static async do(
    page: Page,
    betElement: ElementHandle<Element>,
    amount: number,
    knownOdds: number,
    cursor: GhostCursor,
  ): Promise<PostulateResult> {
    // await cursor.move(betElement);

    // Postulate bet
    betElement.click({ delay: randomInt(1, 20) });

    const postulated = await firstValueFrom(
      from(this.waitForPostulation(page)).pipe(timeout(8000)),
    ).catch((err) => {
      console.log(`${BookieName.Bookmaker}: Postulation took too long`);
      return false;
    });

    if (!postulated) {
      return {
        valid: false,
        odds: null,
        reason: `Failed to postulate`,
      };
    }

    // Verify betslip is not blocked
    const betslipBlocked = Boolean(
      await page.$('.betslip-container .bet.off-the-board'),
    );

    const messages = await page
      .$$eval('.betslip-container .message', (elements) => {
        // @ts-ignore
        return [...elements].map((el) => el.textContent.trim());
      })
      .catch((err) => {
        console.log(`${BookieName.Bookmaker}: No postulation messages`);
        return [];
      });

    if (messages.length) {
      console.log(`${BookieName.Bookmaker} postulate messages:`, messages);
    }

    if (!betslipBlocked) {
      // Retrieve given odds
      const odds = await page.$eval(
        '.betslip-container .bet .odds',
        (element) => +element.textContent,
      );

      // Betslip should be there at this moment
      const stakeInput = await page.waitForSelector(
        '.betslip-container .bet-amounts input',
        {
          timeout: 5000,
        },
      );

      // Postulate bet
      // await cursor.move(stakeInput);
      await stakeInput.focus();
      await stakeInput.type(amount.toString());

      if (odds >= knownOdds) {
        return {
          valid: true,
          odds: odds,
          reason: undefined,
        };
      } else {
        return {
          valid: false,
          odds: odds,
          reason: 'Odds changed',
        };
      }
    }

    return {
      valid: false,
      odds: 0,
      reason: 'Betslip blocked',
    };
  }

  /**
   * Waits for postulate confirmation
   * @param page
   * @returns
   */
  private static async waitForPostulation(page: Page) {
    const matchupEndpoint = `/GetMaxRiskAsync`;
    const { statusCode } = await waitForResponse<PostulateResponse>(
      page,
      matchupEndpoint,
      jsonable,
    );

    return statusCode === 200;
  }
}
