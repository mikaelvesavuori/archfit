import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { lessOrEqual } from '../../infrastructure/utils/math/lessOrEqual';
import { toPercent } from '../../infrastructure/utils/string/toPercent';
import { value } from '../../infrastructure/utils/string/value';

/**
 * @description Calculates the ratio of servers to serverless functions/containers.
 */
export function ratioServersToServerlessFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const serverCount = input.data.ec2Instances?.length || 0;
  const lambdaCount = input.data.lambdaFunctions?.length || 0;
  const fargateCount = input.data.fargateTasks?.length || 0;
  const serverlessCount = lambdaCount + fargateCount;
  const percentage = toPercent(serverCount, serverlessCount);

  const success = lessOrEqual(percentage, threshold);
  const actual = `${value(percentage, '%')} servers-to-serverless`;

  return {
    name,
    success,
    threshold,
    actual
  };
}
