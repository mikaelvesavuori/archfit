import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { lessOrEqual } from '../../infrastructure/utils/math/lessOrEqual';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Checks if Lambda functions have versioning enabled.
 *
 * The threshold represents the number of percent of Lambda functions that must be versioned.
 *
 * The threshold is a "less or equal" check, meaning that:
 *
 * - If the threshold is 100%, then all Lambda functions must be versioned.
 * - If the threshold is 0%, then no Lambda functions must be versioned.
 *
 * You can of course mix these as needed.
 */
export function lambdaVersioningFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaFunctions } = input.data;
  const functions = lambdaFunctions || [];

  const usage = versioningUsage(functions);
  const { functionCount, versionedFunctionCount, functionsWithVersioning } =
    usage;

  const percent = toPercent(versionedFunctionCount, functionCount);
  const success = lessOrEqual(percent, threshold);
  const actual = (() => {
    const base = `Versioning is used in ${versionedFunctionCount}/${functionCount} functions (${percent}%)`;
    if (versionedFunctionCount > 0)
      return base + `: ${functionsWithVersioning}`;
    return base;
  })();

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
function versioningUsage(functionConfigs: FunctionConfiguration[]) {
  const functionCount = functionConfigs.length;

  const functionsWithVersioning = functionConfigs
    .filter(
      (functionConfig: FunctionConfiguration) =>
        functionConfig.Version !== '$LATEST'
    )
    .map(
      (functionConfig: FunctionConfiguration) => functionConfig.FunctionName
    );

  const versionedFunctionCount = functionsWithVersioning.length;

  return {
    functionCount,
    versionedFunctionCount,
    functionsWithVersioning
  };
}
