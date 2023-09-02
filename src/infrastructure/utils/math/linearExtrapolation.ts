/**
 * @description Takes an `amount`, averaging it over an elapsed duration (`divideBy`),
 * and then linearly extrapolates what the final amount will be over a longer duration (`range`).
 */
export function linearExtrapolation(
  amount: number,
  divideBy: number,
  range: number
) {
  const average = divideBy === 0 ? amount : amount / divideBy;
  return average * range;
}
