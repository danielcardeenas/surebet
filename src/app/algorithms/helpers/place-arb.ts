import { ArbGroup } from '../../models';

export async function placeArb(arb: ArbGroup) {
  return Promise.all(arb.map(({ bet }) => bet.place()));
}
