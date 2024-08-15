import { BookieName } from '@models';

const sharpBookies = [
  BookieName.Betfair,
  BookieName.Pinnacle,
  BookieName.Matchbook,
  BookieName.BetInAsia,
];

/**
 * Checks if given bookie is sharp
 * @param bookie 
 * @returns 
 */
export function isSharpBookie(bookie: BookieName) {
  return sharpBookies.includes(bookie);
}