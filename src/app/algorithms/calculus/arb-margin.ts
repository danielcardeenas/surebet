/**
 * Calculates exact arb profit margin % (Before any rounding or adjustment)
 * @param odds 
 * @returns 
 */
export function trueArbMargin(odds: number[]) {
  // prettier-ignore
  return odds.reduce((prev, curr) =>  prev + ((1 / curr) * 100), 0);
}
