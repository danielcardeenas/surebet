/**
 * @returns Generic ID
 */
export function genId() {
  return Math.round(new Date().getTime() / 100);
}
