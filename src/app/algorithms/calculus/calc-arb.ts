import { Bookie } from '@bookies';
import { BookieBet } from '@models';
import { rates } from '@money/rates';
import { Money } from '@money/types';
import { convert } from 'cashify';

const defaultOptions = {
  round: 10,
  maximize: undefined,
};

/**
 * Calculates arb info
 * @param group
 * @param invest
 * @param options
 * @returns
 */
export function calcArb(
  group: BookieBet[],
  invest: Money,
  options: {
    round: number;
    maximize?: {
      bookie: Bookie;
      stake: Money;
    };
  } = defaultOptions,
) {
  const returnPercent =
    1 / group.reduce((prev, curr) => prev + 1 / curr.bet.odds, 0);

  // If maximize needed
  if (options.maximize) {
    // Index of bookie to maximize
    const indexToMaximize = group
      .map((b) => b.bookie.name)
      .indexOf(options.maximize.bookie.name);

    if (indexToMaximize !== -1) {
      invest.currency = options.maximize.stake.currency;
      invest.amount =
        (options.maximize.stake.amount * group[indexToMaximize].bet.odds) /
        returnPercent;
    }
  }

  // Stakes
  let stakes = group.map(
    ({ bet }) => (1 / bet.odds) * returnPercent * invest.amount,
  );

  // Rounding
  if (options.round !== 0) {
    stakes = stakes.map(
      (stake) => options.round * Math.round(stake / options.round),
    );
  }

  // If maximize needed
  if (options.maximize) {
    // Index of bookie to maximize
    const indexToMaximize = group
      .map((b) => b.bookie.name)
      .indexOf(options.maximize.bookie.name);

    if (indexToMaximize !== -1) {
      stakes[indexToMaximize] =
        (1 / group[indexToMaximize].bet.odds) * returnPercent * invest.amount;
    }
  }

  // Net winnings and profit
  let stakesSum = stakes.reduce((prev, curr) => prev + curr, 0);
  let winnings = stakes.map((stake, index) => group[index].bet.odds * stake);
  let profits = winnings.map((net) => net - stakesSum);

  // Make currency convertions
  stakes = stakes.map((stake, index) =>
    currencyExchange(stake, invest, group[index].bookie),
  );
  winnings = winnings.map((winning, index) =>
    currencyExchange(winning, invest, group[index].bookie),
  );
  profits = profits.map((profit, index) =>
    currencyExchange(profit, invest, group[index].bookie),
  );

  return group.map((b, index) => {
    return {
      stake: stakes[index].toFixed(b.bookie.currency.minorUnit),
      winnings: winnings[index].toFixed(b.bookie.currency.minorUnit),
      profit: profits[index].toFixed(b.bookie.currency.minorUnit),
      currency: b.bookie.currency.code,
      bet: b.bet,
      bookie: b.bookie,
      viable: profits[index] >= 2.5
    };
  });
}

/**
 * Converts stake from invest unit to bookie unit
 * @param unitStake
 * @param invest
 * @param bookie
 */
function currencyExchange(unitStake: number, invest: Money, bookie: Bookie) {
  return convert(unitStake, {
    from: invest.currency.code,
    to: bookie.currency.code,
    base: invest.currency.code,
    rates: rates.base[invest.currency.code],
  });
}
