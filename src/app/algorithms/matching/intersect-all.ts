import { BookieBet, BookieEvent, BookieEvents, Tuple } from '../../models';
import { intersectN } from './intersect';

/**
 * Intersects all posible combinations
 * [1, 2, 3] => [1x2, 1x3, 2x3]
 * @param tuples ( bookie and events )
 */
export function intersect2(
  tuples: BookieEvents[],
  intersectRule: (events: BookieEvent[]) => boolean = () => true,
) {
  let groups: Tuple<BookieBet, 2>[] = [];
  for (let i = 0; i < tuples.length; i++) {
    for (let k = i + 1; k < tuples.length; k++) {
      if (tuples[i] !== tuples[k]) {
        const matches = intersectN(intersectRule, tuples[i], tuples[k]);
        groups = groups.concat(matches);
      }
    }
  }

  return groups;
}

/**
 * Intersects all posible combinations
 * [1, 2, 3, 4] => [1x2x3, 1x2x4, 1x3x4, 2x3x4]
 * @param tuples ( bookie and events )
 */
export function intersect3(tuples: BookieEvents[]) {
  let bookiesIntersections: Tuple<BookieBet, 3>[] = [];

  for (let i = 0; i < tuples.length; i++) {
    for (let k = i + 1; k < tuples.length; k++) {
      for (let j = k + 1; j < tuples.length; j++) {
        const matches = intersectN(() => true, tuples[i], tuples[k], tuples[j]);
        if (matches.length) {
          bookiesIntersections = bookiesIntersections.concat(matches);
        }
      }
    }
  }

  return bookiesIntersections;
}
