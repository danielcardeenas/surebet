import { Bookie } from '../../bookies/bookie';
import { BetEvent } from '../bet-event';

export type BookieEvents = {
  bookie: Bookie;
  events: BetEvent[];
};
