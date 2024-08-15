export function safeParseJSON<T = any>(data: string) {
  try {
    return JSON.parse(data.toString()) as T;
  } catch (error) {
    return null;
  }
}
