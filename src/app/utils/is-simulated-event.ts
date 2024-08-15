/**
 * Checks if event is simulated or virtual reality
 * @param eventTitle 
 * @returns 
 */
export function isSimulatedEvent(eventTitle: string) {
  const title = eventTitle.toLowerCase();
  return ['random', 'svr'].some((v) => title.includes(v));
}
