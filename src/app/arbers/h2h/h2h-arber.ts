import {
  biggestArb,
  intersect2,
  matchesToArbs,
  postulateArb,
} from '@algorithms';
import {
  ArbGroup,
  BookieBet,
  BookieEvent,
  BookieEvents,
  BookieName,
  BookieRetrieverTuple,
} from '@models';
import { Money } from '@money/types';
import { arbLogger } from '@utils';
import { combineLatest, from, interval, Observable } from 'rxjs';
import { exhaustMap, filter, map, skip, tap } from 'rxjs/operators';
import { EventAccomulatorArber } from '../base/accomulator.arber';
import { orderedPlace } from '../../algorithms/helpers/ordered-place';

let readline = require('readline');
readline.emitKeypressEvents(process.stdin);


const bannedIntersection = [BookieName.Betfair, BookieName.BetInAsia];
const rule = (events: BookieEvent[]) => {
  return !events.every((be) => bannedIntersection.includes(be.event.bookie));
};
export class H2HArber extends EventAccomulatorArber {
  // Banned matches in current run
  protected banned: {
    bookie: BookieName;
    bet: string;
  }[] = [
      // {
      //   bookie: BookieName.Caliente,
      //   bet: 'Daria',
      // },
    ];

  // Monitor function
  private monitorFn: () => Observable<BookieEvents>[];

  // Intersect mode (2 way)
  private intersectFn = intersect2;

  constructor(
    protected retrievers: BookieRetrieverTuple[],
    protected investment: Money,
  ) {
    super(retrievers, investment, 5);

    process.stdin.on('keypress', (ch, key) => {
      if (key && key.name == 'space') {
        // do something usefull
        console.log('Space pressed');
        if (this.blocked) {
          this.resume();
          console.log('Resumed');
        } else {
          this.pause();
          console.log('Paused');
        }
      }
    });
  }

  /**
   * Main function.
   * Fires arbing
   */
  public async start() {
    // Start arb proccess
    // if (this.retrievers.every(({ bookie }) => bookie.authenticated)) {
    //   this.place().subscribe((a) => {
    //     const bet365 = a.find(
    //       (b) => b.arb.bookie.name === BookieName.Bet365 && b.placed,
    //     );
    //     if (bet365) {
    //       bet365.arb.bookie.pause();
    //     }
    //   });
    // } else {
    //   console.log('Arber', this.id);
    //   console.log('Some bookies are not authenticated');
    //   console.log(
    //     'Will only reach selection chain (excluding postulation and placing)',
    //   );
    //   this.selection(true).subscribe();
    // }
    this.place().subscribe(async (a) => {
      const result = await a;
      console.log(result);
    });
  }

  /**
   * Initializes variables needed before start arbing proccess.
   *
   * Monitor function generation
   */
  private initialize() {
    // Initialize monitor fn
    this.monitorFn = () =>
      this.retrievers.map((r) => {
        return from(r.retriever()).pipe(
          map((events) => {
            return { bookie: r.bookie, events };
          }),
        );
      });
  }

  /**
   * 1st Step. Data creation chain
   *
   * Starts monitoring bookies. Creates BookieEvents
   * @param each Ticking interval in ms
   * @returns
   */
  monitor(each = 150) {
    // Monitor is always the first step. So initialize here
    this.initialize();

    if (!this.monitorFn) {
      throw 'Monitor function needs to be defined';
    }

    // Will emit events tuples each ms interval
    const monitor = interval(each).pipe(
      filter(() => !this.blocked),
      exhaustMap(() => combineLatest(this.monitorFn())),
      filter(() => !this.blocked),
      skip(2),
    );

    return monitor;
  }

  /**
   * 2nd Step. Arb lookup chain
   *
   * Quickly intersects the events
   * and looks for the best arb opportunity
   */
  selection(log = false) {
    // Intersect bets to create possible matches
    const selection = this.monitor().pipe(
      map((bookieEvents) => {
        // Intersect and filter banned matches
        const groups = this.intersectFn(bookieEvents, rule).filter((group) =>
          this.hasBannedMatch(group),
        );

        // Create arb opportunities
        const arbs = matchesToArbs(groups, { ...this.investment });
        return arbs;
      }),
      // tap((arbs) => console.log(arbs)),
      tap((arbs) => this.accomulate(arbs)),
      map((arbs) => arbs.filter((arb) => this.isConstantArb(arb))),
      filter((arbs) => !!arbs.length),
      map((arbs) => biggestArb(arbs)),
      filter(() => !this.blocked),
      tap((arb) => {
        // Before postulation event
        // Notify postulating
        // this.notifyPostulating(arb.map(({ bookie }) => bookie));

        // If logging indicated
        log && arbLogger(arb);
      }),
    );

    return selection;
  }

  /**
   * 3rd Step. Postulation chain
   *
   * Postulates given arb opportunity
   */
  private postulate() {
    const postulate = this.doPostulate(this.selection()).pipe(
      // After postulation event
      tap(async (results) => {
        const anyInvalid = results.some((result) => !result.postulation.valid);
        if (anyInvalid) {
          // If any of the postulation is invalid, clean both betslips
          await Promise.all(results.map((r) => r.arb.bet.clean()));
          this.resetStatus();
          this.resume();
        }
      }),
      filter((results) => results.every((result) => result.postulation.valid)),
      tap((results) => {
        // Before place event
        // Notify placing
        this.notifyPlacing(results.map((r) => r.arb.bookie));
      }),
    );

    return postulate;
  }

  /**
   * 4th Step. Placing chain
   *
   * Places given postulations
   * @returns
   */
  private place() {
    const place = this.postulate().pipe(
      map((results) => {
        return Promise.all(
          results.map(({ arb }) =>
            arb.bet.place().then((placed) => {
              return { placed, arb };
            }),
          ),
        );
      }),
    );

    // const place = this.postulate().pipe(
    //   map(async (results) => {
    //     if (results.some((r) => r.arb.bookie.name === BookieName.Cloudbet)) {
    //       const result = await orderedPlace(
    //         results.find((r) => r.arb.bookie.name === BookieName.Cloudbet).arb.bet,
    //         results.find((r) => r.arb.bookie.name !== BookieName.Cloudbet).arb.bet
    //       );

    //       return result;
    //     }

    //     return Promise.all(
    //       results.map(({ arb }) =>
    //         arb.bet.place().then((placed) => {
    //           return { placed, arb };
    //         }),
    //       ),
    //     );
    //   }),
    // );

    return place;
  }

  /**
   * Tries to postulate the arb match
   * @param selection
   * @returns
   */
  private doPostulate(selection: Observable<ArbGroup>) {
    return selection.pipe(
      filter(() => !this.blocked),
      tap(() => this.pause()),
      tap((best) => arbLogger(best)),
      tap(() => (this.accomulator = [])),
      exhaustMap((arbGroup) =>
        postulateArb(arbGroup).pipe(
          // map(postulations => {
          //   if (postulations.some(postulation => 'maxStake' in postulation)) {
          //     // Needs to recalculate
          //   }
          // }),
          map((postulationResults) => {
            return postulationResults.map((result, index) => {
              return {
                postulation: result,
                arb: arbGroup[index],
              };
            });
          }),
        ),
      ),
      // Log postulation results
      tap((result) => console.log(result.map((r) => r.postulation))),
    );
  }

  /**
   * Checks if any bookie bet is banned atm
   * @param group
   * @returns
   */
  private hasBannedMatch(group: [BookieBet, BookieBet]) {
    const hasBannedMatch = group.some((bb) => {
      return this.banned.includes({
        bookie: bb.bookie.name,
        bet: bb.bet.title,
      });
    });

    return !hasBannedMatch;
  }

  /**
   * Bans matches from current run
   * @param toBan
   */
  private banMatches(
    toBan: {
      bet: string;
      bookie: BookieName;
    }[],
  ) {
    this.banned.push(...toBan);
  }

  /**
   * When terminating
   * Close all the bookie instances
   */
  protected async onClose() {
    console.log('Banned matches:', this.banned);
  }
}
