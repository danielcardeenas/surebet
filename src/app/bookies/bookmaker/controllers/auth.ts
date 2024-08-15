import { BookieName, Credentials } from '@models';
import { randomInt, sleep } from '@utils';
import { Page } from 'puppeteer';
import { firstValueFrom, merge } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Login for Pinnacle
 */
export class Login {
  constructor(private credentials: Credentials, private page: Page) {}

  /**
   * Executes login routine
   */
  public async do() {
    if (await this.shouldPerformLogin()) {
      await this.performLogin();
      // console.log(`${BookieName.Bookmaker}: please login manually`);
    }

    const authenticated = await this.isAuthenticated(0);

    console.log(
      `${BookieName.Bookmaker}: authenticated: ${authenticated ? `✅` : `❌`}`,
    );

    return authenticated;
  }

  private async performLogin() {
    const usernameInput = await this.page.waitForSelector('#account');
    const passwordInput = await this.page.waitForSelector('#password');

    await usernameInput.type(this.credentials.user, {
      delay: randomInt(100, 300),
    });

    await passwordInput.type(this.credentials.password, {
      delay: randomInt(100, 300),
    });

    await this.page.keyboard.press('Enter');
  }

  /**
   * Decides wether or not should authenticate
   * @returns
   */
  private shouldPerformLogin() {
    return firstValueFrom(
      merge(
        this.isAuthenticated().then((response) => !response),
        this.needsAuth(),
      ).pipe(take(1)),
    );
  }

  /**
   * True if authenticated
   * @param timeout
   * @returns
   */
  private isAuthenticated(timeout = 8000) {
    return this.page
      .waitForSelector('app-player-balance', { timeout: timeout })
      .then((el) => !!el)
      .catch(() => false);
  }

  /**
   * True if not authenticatd
   * @returns
   */
  private needsAuth() {
    return this.page
      .waitForSelector('#loginBox', { timeout: 8000 })
      .then((el) => !!el)
      .catch(() => false);
  }
}
