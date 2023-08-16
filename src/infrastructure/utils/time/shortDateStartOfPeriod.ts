/**
 * @description Extends a date to the first day of the month in the period provided.
 * The format is `YYYY-MM-01`.
 */
export function shortDateStartOfPeriod(period: number) {
  const date = new Date();
  date.setDate(date.getDate() - period);

  const iso = date.toISOString();
  const year = iso.split('-')[0];
  const month = iso.split('-')[1];

  return `${year}-${month}-01`;
}
