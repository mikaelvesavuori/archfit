/**
 * @description Creates a past date corresponding to X number of days ago.
 */
export function pastDate(days: number) {
  return new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);
}
