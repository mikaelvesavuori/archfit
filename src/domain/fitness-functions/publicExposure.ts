import { lessOrEqual } from '../../infrastructure/utils/math/lessOrEqual';
import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

/**
 * @description Fitness function to evaluate if there are too many public resources.
 *
 * The threshold represents an absolute number.
 */
export function publicExposureFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { publicS3Buckets, exposedDatabases } = input.data;
  const s3Count = publicS3Buckets?.length || 0;
  const rdsCount = exposedDatabases?.length || 0;
  const count = s3Count + rdsCount;

  const success = lessOrEqual(count, threshold);

  const actual = `Detected ${count} public resources (${s3Count} S3 buckets, ${rdsCount} RDS databases)`;

  return {
    name,
    success,
    threshold,
    actual
  };
}
