import { Money } from '@money/types';
import { safeParseJSON } from '@utils';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { singleton } from 'tsyringe';
import * as WebSocket from 'ws';
import { InstanceStatus } from './models';
import { ArberStatus } from './models/arber-instance';
import * as strategies from './strategies';

const wsServerUrl = 'ws://localhost:8080';

@singleton()
export class WSBroker {
  private ws: WebSocket;
  private ready$ = new BehaviorSubject(false);

  constructor() {
    this.ws = new WebSocket(wsServerUrl, { followRedirects: true });
    this.listen();
  }

  /**
   * Waits for web socket broker to be ready
   * @param time
   * @returns
   */
  public ready(wait = 5000) {
    return this.ready$.pipe(
      filter((v) => v),
      take(1),
      timeout(wait),
      catchError(() => of(false)),
      take(1),
    );
  }

  /**
   * Starts listening to messages
   */
  private listen() {
    // Connection
    this.ws.on('open', () => {
      this.ready$.next(true);
      strategies.outgoing.clientConnected();
    });

    // Message
    this.ws.on('message', this.handleIncoming.bind(this));
  }

  /**
   * Handle incoming messages
   * @param data
   */
  private handleIncoming(data: WebSocket.Data) {
    console.log('Incoming:', data);
    const message = safeParseJSON(data.toString());

    if (message) {
      if (strategies.incoming[message.event]) {
        strategies.incoming[message.event](message.data);
      } else {
        console.log('Unsupported incoming event', message.event);
      }
    } else {
      console.log('Failed to parse data %s', data);
    }
  }

  // Controls going to Broker
  // ------------------------------

  /**
   * Sends generic message to ws broker
   * @param message
   */
  public send(message: any) {
    if (this.ready$.value) {
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Notifies wsbroker when a bookie has been created
   * @param id
   * @param bookieName
   */
  public arberCreated(
    id: string,
    arberName: string,
    instances: string[],
    investment: Money,
  ) {
    if (this.ready$.value) {
      strategies.outgoing.arberCreated(id, arberName, instances, investment);
    }
  }

  /**
   * Notifies wsbroker when a an arber has been paused
   * @param id
   * @param bookieName
   */
  public arberPaused(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.arberPaused(id);
    }
  }

  /**
   * Notifies wsbroker when an arber has been resumed
   * @param id
   * @param bookieName
   */
  public arberResumed(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.arberResumed(id);
    }
  }

  /**
   * Notifies wsbroker when an aber updated his investment
   * @param id
   */
  public arberInvestmentUpdated(id: string, investment: Money) {
    if (this.ready$.value) {
      strategies.outgoing.arberInvestmentUpdated(id, investment);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been terminated
   * @param id
   */
  public arberClosed(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.arberClosed(id);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been terminated
   * @param id
   */
  public arberStatusChanged(id: string, status: ArberStatus) {
    if (this.ready$.value) {
      strategies.outgoing.arberStatusUpdated(id, status);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been created
   * @param id
   * @param bookieName
   */
  public bookieCreated(id: string, bookieName: string, currencyCode: string) {
    if (this.ready$.value) {
      strategies.outgoing.bookieCreated(id, bookieName, currencyCode);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been paused
   * @param id
   */
  public bookiePaused(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.bookiePaused(id);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been paused
   * @param id
   */
  public bookieResumed(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.bookieResumed(id);
    }
  }

  /**
   * Notifies wsbroker when a bookie has been terminated
   * @param id
   */
  public bookieClosed(id: string) {
    if (this.ready$.value) {
      strategies.outgoing.bookieClosed(id);
    }
  }

  /**
   * Notifies wsbroker when a bookie is trying to maximize
   * @param id
   */
  public bookieMaxing(id: string, maxing: boolean) {
    if (this.ready$.value) {
      strategies.outgoing.bookieMaxing(id, maxing);
    }
  }

  /**
   * Notifies wsbroker when a bookie updated his balance
   * @param id
   */
  public bookieBalanceUpdated(id: string, amount: number) {
    if (this.ready$.value) {
      strategies.outgoing.bookieBalanceUpdated(id, amount);
    }
  }

  /**
   * Notifies wsbroker when a bookie updated his balance
   * @param id
   */
  public bookieStatusUpdated(id: string, status: InstanceStatus) {
    if (this.ready$.value) {
      strategies.outgoing.bookieStatusUpdated(id, status);
    }
  }
}
