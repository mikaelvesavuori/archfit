import { firstDayOfMonth } from './firstDayOfMonth';

/**
 * @description Get the first day of the current month in `YYYY-MM-DD` format.
 */
export function firstDayOfCurrentMonthShort() {
  const date = new Date();

  return firstDayOfMonth(date.getUTCFullYear(), date.getUTCMonth())
    .toISOString()
    .split('T')[0];
}
