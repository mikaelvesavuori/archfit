/**
 * @description Convert to a percentage.
 */
export function toPercent(first: number, second: number) {
  if (!second || second === 0) return first;
  return (first / second) * 100;
}
