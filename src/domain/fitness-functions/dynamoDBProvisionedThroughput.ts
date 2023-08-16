import { TableDescription } from '@aws-sdk/client-dynamodb';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';
import { DynamoDBCapacityUtilization } from '../../interfaces/DynamoDBCapacityUtilization';

import { withinTolerance } from '../../infrastructure/utils/math/withinTolerance';

/**
 * @description Checks if the provisioned throughput of DynamoDB tables are within the specified threshold.
 *
 * The threshold adds a "tolerance"/variance as a number of percent on top of the capacity utilization.
 */
export function dynamoDBProvisionedThroughputFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { dynamoDBMaxUtilization, dynamoDBTables } = input.data;

  const check = checkProvisioning(
    dynamoDBMaxUtilization || {},
    dynamoDBTables || [],
    threshold
  );

  const success = check.success;
  const actual = check;

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @param dynamoDBMaxUtilization
 * @param dynamoDBTables
 * @param threshold
 * @example
 */
function checkProvisioning(
  dynamoDBMaxUtilization: DynamoDBCapacityUtilization,
  dynamoDBTables: TableDescription[],
  threshold: number
): Record<string, any> {
  const provisionedTables = dynamoDBTables.filter(
    (table: TableDescription) =>
      table.BillingModeSummary?.BillingMode === 'PROVISIONED'
  );

  const results: Record<string, any> = {
    success: true
  };

  if (
    Object.keys(dynamoDBMaxUtilization).length === 0 ||
    provisionedTables.length === 0
  )
    return results;

  provisionedTables.forEach((table: TableDescription) => {
    const tableName = table.TableName as string;
    const readCapacityUnits = table.ProvisionedThroughput
      ?.ReadCapacityUnits as number;
    const writeCapacityUnits = table.ProvisionedThroughput
      ?.WriteCapacityUnits as number;

    const utilization = dynamoDBMaxUtilization[tableName];

    const { readCapacityUtilization, writeCapacityUtilization } = utilization;

    const readWithinTolerance = withinTolerance(
      readCapacityUnits,
      readCapacityUtilization,
      threshold
    );
    const writeWithinTolerance = withinTolerance(
      writeCapacityUnits,
      writeCapacityUtilization,
      threshold
    );

    if (!readWithinTolerance || !writeWithinTolerance) results.success = false;

    results[tableName] = {
      readWithinTolerance,
      writeWithinTolerance
    };
  });

  return results;
}
