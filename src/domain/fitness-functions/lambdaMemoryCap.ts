import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

/**
 * @description Check that the memory cap of all Lambda functions is not greater than the threshold.
 */
export function lambdaMemoryCapFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaFunctions } = input.data;
  const functions = lambdaFunctions || [];

  const oversizedFunctions = functionsWithMoreMemoryThanThreshold(
    functions,
    threshold
  );

  const success = oversizedFunctions.length === 0;
  const actual = `Found ${oversizedFunctions.length} oversized functions (over ${threshold} MB)`;

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @description Filter out functions with memory size greater than the threshold.
 */
function functionsWithMoreMemoryThanThreshold(
  functionConfigs: FunctionConfiguration[],
  threshold: number
) {
  return functionConfigs.filter(
    (functionConfig: FunctionConfiguration) =>
      functionConfig.MemorySize && functionConfig.MemorySize > threshold
  );
}
