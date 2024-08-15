import { BetEvent } from '..';
import { Bookie } from '../../bookies/bookie';

export type BookieEvent = {
  event: BetEvent;
  bookie: Bookie;
};
