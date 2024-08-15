import { Bookie } from '@bookies';
import { BetEvent } from '@models';

export type BookieRetrieverTuple = {
  bookie: Bookie;
  retriever: () => Promise<BetEvent[]>;
};
