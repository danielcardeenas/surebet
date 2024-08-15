/**
 * Generates random number between given numbers (Inclusive)
 * @param min 
 * @param max 
 * @returns 
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * max) + min;
};
