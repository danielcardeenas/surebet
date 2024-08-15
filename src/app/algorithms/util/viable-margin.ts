import { trueArbMargin } from '@algorithms';
import { BookieBet } from '@models';

/**
 * Odds calculator
 * Verifies is given odds are suitable for an arb opportunity
 */
export function isViableGroup(betGroup: BookieBet[], min = 1, max = 50) {
  const odds = betGroup.map(({ bet }) => bet.odds);
  const arb = 100 - trueArbMargin(odds);
  if (arb >= 0.01) {
    const title = betGroup.map(({ bet }) => bet.title).join(' ~ ');
    console.log(arb, title, odds);
  }
  return arb >= min && arb <= max;
}
