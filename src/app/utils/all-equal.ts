/**
 * Checks if all values in array are equal
 * @param array
 * @returns
 */
export function allEqual<T>(array: T[]) {
  return array.every((v) => v === array[0]);
}
