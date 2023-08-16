import { pastDate } from './pastDate';

/**
 * @description Get a day in the past in `YYYY-MM-DD` format.
 */
export function shortDate(days: number) {
  return pastDate(days).toISOString().split('T')[0];
}
