/**
 * @description Get the first day of a month.
 */
export function firstDayOfMonth(year: number, month: number): Date {
  const time = `${year}-${cleanedMonth(month)}-01T00:00:00.000Z`;
  return new Date(time);
}

const cleanedMonth = (month: number) => {
  const cleanMonth = month + 1; // We don't use zero-based months here
  return cleanMonth < 10 ? `0${cleanMonth}` : `${cleanMonth}`;
};
