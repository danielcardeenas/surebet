import { BookieBet, BookieEvent, BookieEvents, Tuple } from '@models';
import { fuzzByTitle } from '../fuzz/title.fuzz';
import { Curator } from './curator';

/**
 * Interesects same matches between two bookies by title
 * @param leftSide
 * @param rightSide
 */
export function intersectN<T extends Tuple<BookieEvents, number>>(
  intersectRule: (events: BookieEvent[]) => boolean = () => true,
  ...tuple: T
): Tuple<BookieBet, T['length']> {
  // Left side has to be the one with less events for performance reasons (save iterations)
  // Sort by length (min to max)
  tuple = tuple.sort((a, b) => a.events.length - b.events.length);

  // Correctly intersected matches
  const interesecteds: BookieBet[][] = [];

  const sourceBookie = tuple[0];
  const remainingBookies = tuple.slice(1);

  sourceBookie.events.forEach((sourceEvent) => {
    let reminder: BookieEvent[] = [];
    for (let i = 0; i < remainingBookies.length; i++) {
      const [result] = fuzzByTitle(sourceEvent, remainingBookies[i].events);
      if (!result || !result[0]) {
        // Event not present on some bookie, ignore this event
        break;
      }

      if (result && result[0]) {
        reminder.push({ bookie: remainingBookies[i].bookie, event: result[0] });
      }
    }

    if (reminder.length === tuple.length - 1) {
      // Match is reminded in all bookie events (excluding source)
      // Meaning it is present in all bookies
      // Join tuple
      const intersectedMatch = [
        ...reminder,
        { bookie: sourceBookie.bookie, event: sourceEvent },
      ];

      if (intersectRule(intersectedMatch)) {
        const bests = Curator.bests<T['length']>(...intersectedMatch);
        const hasDuplicatedBookie =
          new Set(bests.map((b) => b.bookie.name)).size !== bests.length;

        // Only push different bookies
        if (!hasDuplicatedBookie) {
          interesecteds.push(bests);
        }

        // Uncomment when no-duplicate rule is disabled
        // interesecteds.push(bests);
      }
    }
  });

  return interesecteds as Tuple<BookieBet, T['length']>;
}
