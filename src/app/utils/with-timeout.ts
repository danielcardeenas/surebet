/**
 * Puts a timeout to given promise.
 * Will not error out. Instead will return given fallback value
 * @param source
 * @param time
 * @param fallbackTo
 * @returns
 */
export function withTimeout<T>(
  source: Promise<T>,
  time: number,
  fallbackTo: T,
): Promise<T> {
  return Promise.race([
    source,
    new Promise<T>((_r) => setTimeout(() => _r(fallbackTo), time)),
  ]);
}
