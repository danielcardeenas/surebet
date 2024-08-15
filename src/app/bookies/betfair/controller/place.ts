import { PlaceResponse } from '@betfair/models';
import { genId, jsonable, randomInt, screenshot, waitForResponse } from '@utils';
import { ElementHandle, Page } from 'puppeteer';
import { BetfairController } from './base-controller';

export class Place extends BetfairController {
  public static async do(
    page: Page,
    betElement: ElementHandle<Element>,
    knownOdds: number,
  ): Promise<boolean> {
    const placeButton = await this.getPlaceButton(page);
    if (!placeButton) {
      return false;
    }
    
    placeButton.click();

    // const confirmButton = await this.getConfirmButton(page);
    // await confirmButton.click();

    const { placed, response } = await this.isPlaced(page);

    if (placed) {
      console.log(`${this.bookie}: Bet placed ✅`);
    } else {
      console.log(`${this.bookie}: Bet not placed ❌`);
      console.log(response);
      await screenshot(
        page,
        `screenshots/${this.bookie}_${genId()}_place_error.png`,
      );
    }

    return placed;
  }

  private static getPlaceButton(page: Page) {
    return page.waitForSelector('.place-bet:not([disabled])', {
      timeout: 1000,
    }).catch(() => {
      console.log('Place button not found');
      return null;
    });
  }

  // private static getConfirmButton(page: Page) {
  //   return page.waitForSelector('.confirm-bet', {
  //     timeout: 1000,
  //   });
  // }

  private static async isPlaced(page: Page) {
    // Listen to place result
    const { response } = await waitForResponse<PlaceResponse[]>(
      page,
      'etx-json-rpc',
      jsonable,
    );

    return {
      placed: response[0].result.status === 'SUCCESS',
      response: response[0],
    };
  }
}
