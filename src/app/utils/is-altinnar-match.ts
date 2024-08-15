import { BookieName } from '@models';
import { Bookie } from '../bookies/bookie';

const altinnarBookies = [BookieName.Playdoit, BookieName.BigBola];
export const isAltinnarMatch = (bookies: Bookie[]) => {
  return bookies.every((bookie) => altinnarBookies.includes(bookie.name));
};
