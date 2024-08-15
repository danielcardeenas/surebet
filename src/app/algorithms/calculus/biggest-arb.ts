import { ArbGroup } from '../../models';

/**
 * Selects the arb bet with the biggest potential
 * from given arbs array
 * @param arbs
 */
export function biggestArb(arbGroups: ArbGroup[]) {
  return arbGroups.reduce((prev, current) =>
    arbPotential(prev) > arbPotential(current) ? prev : current,
  );
}

function arbPotential(arbGroup: ArbGroup) {
  // prettier-ignore
  return arbGroup.reduce((prev, curr) => prev + (+curr.profit), 0);
}
