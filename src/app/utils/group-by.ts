/**
 * Groups array by given key
 * @param items
 * @param fn
 * @returns
 */
export function groupBy<T, K extends string | number>(
  items: T[],
  fn: (item: T) => K,
): { [key: string]: T[] } {
  return items.reduce(
    (result, item) => ({
      ...result,
      [fn(item)]: [...(result[fn(item).toString()] || []), item],
    }),
    {},
  );
}
