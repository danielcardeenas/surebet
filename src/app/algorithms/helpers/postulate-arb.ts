import { ArbGroup } from '@models';
import { groupBy } from '@utils';
import { from } from 'rxjs';

export function postulateArb(group: ArbGroup) {
  // const usedBookies = group.map((b) => b.bookie.name);
  // if (hasDuplicates(usedBookies)) {
  //   // Postulate by bookie
  //   const arbsByBookie = groupBy(group, (item) => item.bookie.name);
    
  // }

  // Postulate all right away
  const promises = group.map((arb) => {
    return arb.bet.postulate(arb.stake, arb.bookie);
  });

  return from(Promise.all(promises));
}

function hasDuplicates(arr: string[]) {
  return new Set(arr).size !== arr.length;
}
