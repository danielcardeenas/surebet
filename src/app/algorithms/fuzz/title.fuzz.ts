import * as fuzz from 'fuzzball';
import { BetEvent } from '../../models';

// Fuzz configuration
const fuzzByTitleConfig = {
  scorer: fuzz.token_sort_ratio, // Any function that takes two values and returns a score, default: ratio
  processor: (choice: BetEvent) => choice?.title, // Takes choice object, returns string, default: no processor. Must supply if choices are not already strings.
  limit: 1, // Max number of top results to return, default: no limit / 0.
  cutoff: 80, // Lowest score to return, default: 0
  unsorted: false, // Results won't be sorted if true, default: false. If true limit will be ignored.
};

export function fuzzByTitle(
  event: BetEvent,
  vsBetList: BetEvent[],
): [BetEvent, number, number][] {
  const query = `${event.title}`;
  return fuzz.extract(query, vsBetList, fuzzByTitleConfig);
}
