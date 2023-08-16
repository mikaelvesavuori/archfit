/**
 * @description Return a value as a number with an optional suffix.
 */
export function value(val: number, suffix = '') {
  return `${val.toFixed(2)}` + suffix;
}
