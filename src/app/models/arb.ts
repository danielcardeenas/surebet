import { Bookie } from '@bookies';
import { Bet } from '@models';

export interface Arb {
  stake: string;
  winnings: string;
  profit: string;
  currency: string;
  bet: Bet;
  bookie: Bookie;
  viable: boolean;
}

export type ArbGroup = Arb[];
