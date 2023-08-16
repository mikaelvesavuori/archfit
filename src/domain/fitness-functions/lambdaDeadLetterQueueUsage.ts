import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { value } from '../../infrastructure/utils/string/value';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Check if Lambda functions have dead letter queues.
 *
 * The threshold represents the minimum percentage of Lambda functions
 * that should have dead letter queues.
 */
export function lambdaDeadLetterQueueUsageFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaFunctions } = input.data;
  const functions = lambdaFunctions || [];

  const dlqFunctions = functionsWithDeadLetterQueue(functions);
  const percentage = toPercent(dlqFunctions.length, functions.length);

  const success = moreOrEqual(percentage, threshold);
  const actual = value(percentage, '%');

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @param functionConfigs
 * @example
 */
function functionsWithDeadLetterQueue(
  functionConfigs: FunctionConfiguration[]
) {
  return functionConfigs.filter(
    (functionConfig: FunctionConfiguration) =>
      functionConfig.DeadLetterConfig?.TargetArn
  );
}
