/**
 * @description Is this value within the given tolerance?
 * @param val - The value to check.
 * @param norm - The value to compare against.
 * @param tolerance - The tolerance percentage, relative to the norm.
 */
export function withinTolerance(val: number, norm: number, tolerance: number) {
  const deviation = (norm * tolerance) / 100;
  const max = norm + deviation;
  const min = norm - deviation;
  return val >= min && val <= max;
}
