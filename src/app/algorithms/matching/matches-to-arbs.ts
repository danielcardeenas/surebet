import { calcArb } from '@algorithms';
import { Bookie } from '@bookies';
import { ArbGroup, BookieBet } from '@models';
import { Money } from '@money/types';
import { isSharpBookie } from '@utils';
import { isViableGroup } from '../util/viable-margin';

const MIN_ODDS = 1.1;
const defaultOptions = {
  roundTo: 5,
  margin: {
    min: 1,
    max: 30,
    sharpMax: 100,
  },
};

/**
 * Filters matches given
 *
 * Keeps only viable arb matches
 * @returns arbs
 * @param groups
 */
export function matchesToArbs(
  groups: BookieBet[][],
  investment: Money,
  options = defaultOptions,
) {
  const arbGroups: ArbGroup[] = [];

  groups.forEach((group) => {
    if (group.every(({ bet }) => bet.odds >= MIN_ODDS)) {
      const allAreSharp = group.every(({ bookie }) =>
        isSharpBookie(bookie.name),
      );

      // Define min and max profit margin
      const min = options.margin.min;
      const max = allAreSharp ? options.margin.sharpMax : options.margin.max;
      const viable = isViableGroup(group, min, max);
      if (viable) {
        const usedBookies = group.map(({ bookie }) => bookie);

        // Rounding
        // When all are sharp there is no need to round
        // ------------------------------------------------
        const round = allAreSharp ? 0 : options.roundTo;

        // Maximization
        // ------------------------------------------------
        const bookieToMaximize = usedBookies.find(
          (book) => book.wantsToMaximize,
        );
        const maximizeOptions = makeMaximizeOptions(bookieToMaximize);

        // Arb instructions calculation (arb info)
        // ------------------------------------------------
        const arbGroup = calcArb(group, investment, {
          round,
          maximize: maximizeOptions,
        });

        // Push viable arb groups
        // ------------------------------------------------
        if (arbGroup.every((arb) => arb.viable)) {
          arbGroups.push(arbGroup);
        }
      }
    }
  });

  return arbGroups;
}

/**
 * Creates [maximze options] if bookieToMaximize is defined
 * Otherwise returns undefined
 * @param bookieToMaximize
 * @param maximizeTo
 * @returns
 */
function makeMaximizeOptions(bookieToMaximize: Bookie): {
  bookie: Bookie;
  stake: Money;
} {
  if (bookieToMaximize) {
    return {
      bookie: bookieToMaximize,
      stake: {
        amount: bookieToMaximize.balance(),
        currency: bookieToMaximize.currency,
      },
    };
  }

  return undefined;
}
