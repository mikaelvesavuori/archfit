import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { toPercent } from '../../infrastructure/utils/string/toPercent';
import { value } from '../../infrastructure/utils/string/value';

/**
 * @description Fitness function to measure if the number of API Gateway request validators is above a threshold.
 */
export function APIGatewayRequestValidationFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { apiGatewayRequestValidators, apiGatewayInstances } = input.data;

  const numValidators = apiGatewayRequestValidators?.length || 0;
  const numApis = apiGatewayInstances?.length || 0;

  const percentage = toPercent(numValidators, numApis);

  const success = moreOrEqual(percentage, threshold);
  const actual = value(percentage, '%');

  return {
    name,
    success,
    threshold,
    actual
  };
}
