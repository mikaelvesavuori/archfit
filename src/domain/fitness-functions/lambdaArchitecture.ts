import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { value } from '../../infrastructure/utils/string/value';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Check if Lambda functions are using ARM architecture.
 *
 * The threshold represents the minimum percentage of functions that should be using ARM architecture.
 */
export function lambdaArchitectureFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaFunctions } = input.data;
  const functions = lambdaFunctions || [];

  const armFunctions = functionsWithArmArchitecture(functions);

  const percentage = toPercent(armFunctions.length, functions.length);

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
 * @param functions
 * @param functionConfigs
 * @example
 */
function functionsWithArmArchitecture(
  functionConfigs: FunctionConfiguration[]
) {
  return functionConfigs.filter(
    (functionConfig: FunctionConfiguration) =>
      functionConfig?.Architectures?.[0] === 'arm64'
  );
}
