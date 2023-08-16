/**
 * @description Reduces an array of numbers to a single number.
 */
export function reduceToValue(
  input: Record<string, any> | number[] | undefined
): number {
  if (!input) return 0;
  return input.reduce((sum: number, value: number) => sum + value, 0) || 0;
}
