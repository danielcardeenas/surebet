import { Bet } from '@models';
import * as fuzz from 'fuzzball';

/**
 * Retrieves equivalent bet from other bookie event
 * Uses title for deduction
 * @param left
 * @param right
 */
export function equivalentBet(fromBet: Bet, rightBets: Bet[]) {
  // Retrieve the equivalent bet by fuz title
  // Index of right event best fuzz matched bet title
  // tail: biggest index found
  const indexOfHighestFuzzMatch = rightBets.reduce(
    (tail, currentBet, index, array) => {
      const currentBetRank = fuzz.token_set_ratio(
        fromBet.title,
        currentBet.title,
      );
      const prevRank = fuzz.token_set_ratio(fromBet.title, array[tail].title);
      return currentBetRank > prevRank ? index : tail;
    },
    0,
  );

  return rightBets[indexOfHighestFuzzMatch];
}

/**
 * Contraty on equivalent bet
 * @param left
 * @param right
 */
export function oppositeBet(fromBet: Bet, rightBets: Bet[]) {
  // Retrieve the equivalent bet by fuz title
  // Index of right event best fuzz matched bet title
  // tail: biggest index found
  const indexOfLowestFuzzMatch = rightBets.reduce(
    (tail, currentBet, index, array) => {
      const currentBetRank = fuzz.token_set_ratio(
        fromBet.title,
        currentBet.title,
      );
      const prevRank = fuzz.token_set_ratio(fromBet.title, array[tail].title);
      return currentBetRank < prevRank ? index : tail;
    },
    0,
  );

  return rightBets[indexOfLowestFuzzMatch];
}
