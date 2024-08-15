import { BookieBet, BookieEvent, Tuple } from '@models';
import { equivalentBet } from '@utils';

export class Curator {
  /**
   * This functions is expecting the quantity of bets match the size
   * of the events parameters
   *
   * For example:
   *
   * 3 way bet expects 3 BookieEvents
   * 2 way bet expects 2 BookieEvents
   * @param events
   */
  static bestsOutomesAsBookies<T extends Tuple<BookieEvent, number>>(
    ...events: T
  ): Tuple<BookieBet, T['length']> {
    // Sort to make sure we iterate with the most possible bets per event
    // In case some bookie event does not have the complete array of bets
    events = events.sort((a, b) => b.event.bets.length - a.event.bets.length);

    // Source of true for available bets
    const sourceEvent = events[0];

    if (sourceEvent.event.bets.some(b => b.title.includes('Harrogate'))) {
      console.log();
    }

    // Remove source event (events[0]) from remaining events
    const remainingEvents = events.slice(1);
    const bests: BookieBet[] = sourceEvent.event.bets.map((bet, index) => {
      const candidates = remainingEvents.map((ev) => {
        return {
          bookie: ev.bookie,
          bet: bet.genetic.equivalentFrom(ev.event.bets),
        };
      });

      // Merge all options for this genetic
      const options = [
        ...candidates,
        {
          bookie: sourceEvent.bookie,
          bet: bet,
        },
      ];

      // Return best candidate (better odds)
      return options.reduce((prev, curr) =>
        prev.bet.odds > curr.bet.odds ? prev : curr,
      );
    });

    // Bests of each genetic
    return bests as Tuple<BookieBet, T['length']>;
  }

  /**
   * Best bookie bets for each genetic available
   *
   * Number of outcomes can be specified and will return a typed tuple.
   * @param events
   */
  static bests<GeneticOutcomes extends number>(
    ...events: BookieEvent[]
  ): Tuple<BookieBet, GeneticOutcomes> {
    // Sort to make sure we iterate with the most possible bets per event
    // In case some events could not have the complete array of bets
    events = events.sort((a, b) => b.event.bets.length - a.event.bets.length);

    // Source of true for available bets
    const sourceEvent = events[0];

    // Remove source event (events[0]) from remaining events
    const remainingEvents = events.slice(1);
    const bests: BookieBet[] = sourceEvent.event.bets.map((bet) => {
      const candidates = remainingEvents.map((ev) => {
        // When genetic not defined, use bet title as fallback
        const fallbackEquivalent = equivalentBet(bet, ev.event.bets);
        const geneticEquivalent = bet?.genetic?.equivalentFrom(ev.event.bets);
        return {
          bookie: ev.bookie,
          bet: geneticEquivalent || fallbackEquivalent
        };
      });

      // Merge all options for this genetic
      const options = [
        ...candidates,
        {
          bookie: sourceEvent.bookie,
          bet: bet,
        },
      ];

      // Return best candidate (better odds) for this genetic (source bet genetic)
      const best = options.reduce((prev, curr) =>
        prev.bet.odds > curr.bet.odds ? prev : curr,
      );

      return best;
    });

    // Bests of each genetic
    return bests as Tuple<BookieBet, GeneticOutcomes>;
  }
}
