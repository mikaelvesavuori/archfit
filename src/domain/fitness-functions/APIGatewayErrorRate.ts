import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { lessOrEqual } from '../../infrastructure/utils/math/lessOrEqual';
import { value } from '../../infrastructure/utils/string/value';
import { APIGatewayErrorRates } from '../../interfaces/APIGatewayErrorRates';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Fitness function to measure the daily server error rate of all API Gateway instances.
 * The threshold refers to the maximum daily average error rate for any given API Gateway.
 */
export function APIGatewayErrorRateFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold, period } = input;

  const { errorRates } = input.data;
  const actual = assessErrorRates(errorRates || [], threshold, period);
  const success = actual.every((item) => item.success);

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @description Assess the error rates and present results in an easy-to-consume way..
 */
function assessErrorRates(
  errorRates: APIGatewayErrorRates[],
  threshold: number,
  period: number
) {
  return errorRates.map((item) => {
    const dailyAverageErrors = dailyAverageErrorsInPercent(
      item.invocationsCount,
      item.serverErrors,
      period
    );
    return {
      id: item.id,
      success: lessOrEqual(dailyAverageErrors, threshold),
      dailyAverageErrorRate: value(dailyAverageErrors, '%')
    };
  });
}

const dailyAverageErrorsInPercent = (
  invocationsCount: number,
  serverErrors: number,
  period: number
) => toPercent(serverErrors / period, invocationsCount / period);
