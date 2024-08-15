import { Bookie } from '@bookies';
import { WSBroker } from '@broker/broker';
import { ArberStatus } from '@broker/models/arber-instance';
import { WSStore } from '@broker/store';
import { BookieName, BookieRetrieverTuple } from '@models';
import { Money } from '@money/types';
import { Subject } from 'rxjs';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

export abstract class Arber {
  public readonly id: string;
  public readonly name: string;
  public closed = new Subject<boolean>();

  // Broker
  // protected wsBroker: WSBroker;

  // Block rxjs chain
  protected blocked = false;

  // Bookie Childs intances
  protected instances: Bookie[] = [];
  protected store: WSStore;

  constructor(
    protected retrievers: BookieRetrieverTuple[],
    protected investment: Money,
  ) {
    // Assign unique id for this arber
    this.id = v4();
    this.name = this.constructor.name;

    // Initialize controls
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    this.listenKeyboard();

    // Save instances
    this.instances = this.retrievers.map((r) => r.bookie);

    // Resolve store
    this.store = container.resolve(WSStore);
    this.store.addArber(this);

    // Notify WS Broker
    // this.wsBroker = container.resolve(WSBroker);
    // this.wsBroker.arberCreated(
    //   this.id,
    //   this.constructor.name,
    //   this.instances.map((i) => i.id),
    //   this.investment,
    // );
  }

  /**
   * Starts listening to keyboard events
   */
  private listenKeyboard() {
    process.stdin.on('keypress', async (chunk, key) => {
      // console.log(key);

      // Init pause and resume controls
      if (key && key.name == 'p') {
        this.pause();
      }

      if (key && key.name == 'r') {
        this.resume();
      }

      // When terminating
      if (key && key.sequence == '\x03') {
        this.close();
        this.onClose();
        this.closed.next(true);
      }
    });
  }

  /**
   * Pauses arber
   */
  public pause() {
    console.log(`Pausing arber ${this.name}: ${this.id}`);
    this.blocked = true;
    this.wsBroker.arberPaused(this.id);
  }

  /**
   * Resumes arber
   */
  public resume() {
    console.log(`Resuming arber ${this.name}: ${this.id}`);
    this.blocked = false;
    this.wsBroker.arberResumed(this.id);
  }

  /**
   * Updates arber investment
   * @param money
   */
  public setInvestment(money: Money) {
    this.investment = money;
    this.wsBroker.arberInvestmentUpdated(this.id, money);
  }

  /**
   * Notifies when arber is postulating
   *
   * @optional bookies Bookies to set with postulate state
   */
  public notifyPostulating(bookies: Bookie[] = []) {
    bookies.forEach((b) => b.postulating());
    this.wsBroker.arberStatusChanged(this.id, ArberStatus.Postulating);
  }

  /**
   * Notifies when arber is placing
   *
   * @optional bookies Bookies to set with postulate state
   */
  public notifyPlacing(bookies: Bookie[] = []) {
    bookies.forEach((b) => b.placing());
    this.wsBroker.arberStatusChanged(this.id, ArberStatus.Placing);
  }

  /**
   * Notifies when arber is placing
   *
   * @optional bookies Bookies to set with postulate state
   */
  public notifyPlaced(bookies: Bookie[] = []) {
    bookies.forEach((b) => b.placed());
    this.wsBroker.arberStatusChanged(this.id, ArberStatus.Placed);
  }

  /**
   * Notifies when arber back to inital state
   *
   * @optional bookes Bookies to set to initial state
   */
  public resetStatus(bookies: Bookie[] = []) {
    bookies.forEach((b) => b.resetStatus());
    this.wsBroker.arberStatusChanged(this.id, ArberStatus.Created);
  }

  /**
   * Closes arber
   * @returns
   */
  public close() {
    const skip: BookieName[] = [BookieName.Bet365];
    // Close bookies. No need to wait
    this.instances.forEach((i) => {
      if (!skip.includes(i.name)) {
        return i.close();
      }
    });

    // Close this instance
    this.store.closeArber(this.id);
    this.wsBroker.arberClosed(this.id);
  }

  /**
   * Fire arber
   */
  protected abstract start(): void;

  /**
   * On close event
   */
  protected abstract onClose(): void;
}
