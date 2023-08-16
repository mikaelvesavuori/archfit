/**
 * @description Get a count of the number of days in the current month.
 */
export function daysInCurrentMonth() {
  return new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
}
