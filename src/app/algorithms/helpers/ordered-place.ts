import { Bet } from '../../models';
import { from, concat } from 'rxjs';
import { concatMap } from 'rxjs/operators';

/**
 * Custom betslip place where caliente gets priority
 * @param results
 */
export async function orderedPlace(first: Bet, second: Bet) {
  const r1 = await first.place();
  if (r1) {
    console.log('\x07');
    const r2 = await second.place();
    return [r1, r2];
  } else {
    return [false, false];
  }
}

async function orders(bets: Bet[]) {}
