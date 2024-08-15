import { WSBroker } from '@broker/broker';
import { InstanceStatus } from '@broker/models';
import { WSStore } from '@broker/store';
import { BetEvent } from '@models';
import { Currency } from '@money/types';
import { Browser } from 'puppeteer';
import { container } from 'tsyringe';
import { v4 } from 'uuid';
import { BookieName } from '../models/defs/bookie-name.enum';
import { Credentials } from '../models/types/credentials';

export abstract class Bookie {
  public id: string;
  public wantsToMaximize = false;
  public paused = false;
  public authenticated = false;

  protected store: WSStore;
  // protected wsBroker: WSBroker;

  private _balance: number = null;
  private _status: InstanceStatus;
  private mockedRepo: {
    [live: string]: {
      [sport: string]: {
        [market: string]: (...args: any) => Promise<BetEvent[]>;
      };
    };
  };

  /**
   * Each bookie instance has its browser instance
   * @param browser Browser instance
   * @param currency Base initial bookie currency
   */
  constructor(public browser: Browser, public currency: Currency) {
    // Assign unique id for this instance
    this.id = v4();

    // Resolve stire
    this.store = container.resolve(WSStore);
    this.store.addInstance(this);

    // Resolve WS Broker service
    // this.wsBroker = container.resolve(WSBroker);
    // this.wsBroker.bookieCreated(
    //   this.id,
    //   this.constructor.name,
    //   this.currency.code,
    // );
  }

  /**
   * This method should not be called directly.
   *
   * Use `repo()` instead
   */
  public abstract _repo: () => {
    [live: string]: {
      [sport: string]: {
        [market: string]: (...args: any) => Promise<BetEvent[]>;
      };
    };
  };

  /**
   * Sets login instructions
   * @param credentials
   */
  protected abstract _login(credentials: Credentials): Promise<boolean>;

  /**
   * Mandatory bookie name
   */
  public abstract name: BookieName;

  /**
   * Logins into given bookie
   * @param credentials
   */
  public async login(credentials: Credentials): Promise<boolean> {
    this.authenticated = await this._login(credentials);
    return this.authenticated;
  }

  /**
   * Cleans betslip
   * @param credentials
   */
  // public abstract clean(): Promise<void>;

  /**
   * Retrieves bookie balance
   */
  public balance(): number {
    return this._balance;
  }

  /**
   * Retriever repository
   * @returns
   */
  public repo(): ReturnType<this['_repo']> {
    if (this.paused) {
      if (!this.mockedRepo) {
        // Define once and save
        this.mockedRepo = this.mockEmptyRepo();
      }

      return this.mockedRepo as ReturnType<this['_repo']>;
    }

    return this._repo() as ReturnType<this['_repo']>;
  }

  /**
   * Pauses bookie instance
   */
  public pause() {
    this.paused = true;
    this.wsBroker.bookiePaused(this.id);
  }

  /**
   * Resumes bookie instance
   */
  public resume() {
    this.paused = false;
    this.wsBroker.bookieResumed(this.id);
  }

  /**
   * Close bookie instance
   * @returns
   */
  public async close() {
    this.store.closeBookie(this.id);
    this.wsBroker.bookieClosed(this.id);
    await this.browser?.close();
  }

  /**
   * Close bookie instance
   * @returns
   */
  public setMaximize(wants: boolean) {
    this.wantsToMaximize = wants;
    this.wsBroker.bookieMaxing(this.id, this.wantsToMaximize);
  }

  /**
   * Sets current bookie instance balance ($)
   * @param amount
   */
  public setBalance(amount: number) {
    this.wsBroker.bookieBalanceUpdated(this.id, amount);
    this._balance = amount;
  }

  /**
   * Sets current bookie instance balance ($)
   * @param amount
   */
  public setStatus(status: InstanceStatus) {
    this.wsBroker.bookieStatusUpdated(this.id, status);
    this._status = status;
  }

  /**
   * Notifies when bookie is postulating
   *
   * This is optional
   */
  public postulating() {
    this.wsBroker.bookieStatusUpdated(this.id, InstanceStatus.Postulating);
  }

  /**
   * Notifies when bookie is postulating
   *
   * This is optional
   */
  public placing() {
    this.wsBroker.bookieStatusUpdated(this.id, InstanceStatus.Placing);
  }

  /**
   * Notifies when bookie is postulating
   *
   * This is optional
   */
  public placed() {
    this.wsBroker.bookieStatusUpdated(this.id, InstanceStatus.Placed);
  }

  /**
   * Notifies when arber back to inital state
   *
   * This is optional
   */
  public resetStatus() {
    this.wsBroker.bookieStatusUpdated(this.id, InstanceStatus.Created);
  }

  /**
   * Creates an empty mock of the bookie repository
   * @returns
   */
  private mockEmptyRepo(): {
    [live: string]: {
      [sport: string]: {
        [market: string]: (...args: any) => Promise<BetEvent[]>;
      };
    };
  } {
    const cloned = this._repo();
    const clone: any = {};
    Object.keys(cloned).forEach((live) => {
      clone[live] = {};
      Object.keys(cloned[live]).forEach((sport) => {
        clone[live][sport] = {};
        Object.keys(cloned[live][sport]).forEach((market) => {
          clone[live][sport][market] = (...args: any) => Promise.resolve([]);
        });
      });
    });

    return clone;
  }
}
