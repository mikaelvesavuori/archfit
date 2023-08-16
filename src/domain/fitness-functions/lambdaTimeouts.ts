import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { toPercent } from '../../infrastructure/utils/string/toPercent';
import { value } from '../../infrastructure/utils/string/value';

/**
 * @description Fitness function to measure if there are acceptable timeout ratios for Lambda functions.
 *
 * The threshold represents the number of percent of timeouts vs invocations that a Lambda function must have.
 */
export function lambdaTimeoutsFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaTimeouts } = input.data;
  const timeouts = lambdaTimeouts || [];

  const ratios = timeoutRatios(timeouts);

  const success = !ratios.some((ratio) => ratio >= threshold);
  const actual = ratios.map((ratio, index: number) => {
    return {
      functionName: timeouts[index].functionName,
      value: value(ratio, '%')
    };
  });

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 */
function timeoutRatios(timeouts: Record<string, any>[]) {
  return timeouts.map((timeout) =>
    toPercent(timeout.timeoutsCount, timeout.invocationsCount)
  );
}
