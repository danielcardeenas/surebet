import { Bet } from '@models';

/**
 * Cleans given bets
 * @param bookies
 */
export function cleanAll(bets: Bet[]) {
  return Promise.all(bets.map((b) => b.clean()));
}
