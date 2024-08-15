import { Credentials } from '@models';
import { Page } from 'puppeteer';
import { randomInt, sleep } from '@utils';
import { BetfairController } from './base-controller';

const LOGIN_PAGE = 'https://www.betfair.com/exchange/plus/';

/**
 * Login for Betfair
 */
export class Login extends BetfairController {
  constructor(private credentials: Credentials, private page: Page) {
    super();
  }

  /**
   * Executes login routine
   */
  public async do() {
    await this.page.goto(LOGIN_PAGE);

    const isAlreadyAuthenticated = await this.isInside(this.page);
    if (isAlreadyAuthenticated) {
      console.log(`${Login.bookie}: authenticated: ✅`);
      return true;
    }

    const usernameInput = await this.page.waitForSelector(
      '.ssc-lifg [name="username"]',
    );
    const passwordInput = await this.page.waitForSelector(
      '.ssc-lifg [name="password"]',
    );
    const loginButton = await this.page.waitForSelector('#ssc-lis');

    await usernameInput.type(this.credentials.user, { delay: 0 });
    await passwordInput.type(this.credentials.password, { delay: 0 });
    await loginButton.click({ delay: randomInt(1, 50) });

    await sleep(2000);
    const isInside = await this.isInside(this.page);
    console.log(`${Login.bookie}: authenticated: ${isInside ? `✅` : `❌`}`);
    return isInside;
  }

  /**
   * Waits for balance to be shown (Indicates login success)
   * @param page
   */
  private async isInside(page: Page) {
    const balanceElement = await page
      .waitForSelector('[rel="main-wallet"]', {
        timeout: 4000,
      })
      .catch((err) => false);
    return !!balanceElement;
  }
}
