import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { toPercent } from '../../infrastructure/utils/string/toPercent';
import { value } from '../../infrastructure/utils/string/value';

/**
 * @description Checks if Lambda functions are using recent runtimes.
 *
 * The threshold represents the minimum percentage of Lambda functions
 * that need to use recent runtimes.
 */
export function lambdaRuntimesFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { lambdaFunctions } = input.data;
  const functions = lambdaFunctions || [];

  const recentRuntimeFunctions = functionsWithRecentRuntimes(functions);

  const percentage = toPercent(recentRuntimeFunctions.length, functions.length);

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
 * @param functionConfigurations
 * @param functionConfigs
 * @example
 */
function functionsWithRecentRuntimes(functionConfigs: FunctionConfiguration[]) {
  return functionConfigs.filter((functionConfig: FunctionConfiguration) =>
    isValidRuntime(functionConfig.Runtime as string)
  );
}

/**
 * Valid as per August 2023.
 * @see https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
 */
const validRuntimes = [
  'nodejs18.x',
  'nodejs16.x',
  'dotnet7',
  'dotnet6',
  'python3.11',
  'python3.10',
  'java17',
  'go1.x',
  'provided.al2'
];

/**
 * @param runtime
 * @example
 */
function isValidRuntime(runtime: string): boolean {
  return validRuntimes.includes(runtime);
}
