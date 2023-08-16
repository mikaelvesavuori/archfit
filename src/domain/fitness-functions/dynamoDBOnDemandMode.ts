import { TableDescription } from '@aws-sdk/client-dynamodb';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { value } from '../../infrastructure/utils/string/value';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Check if DynamoDB tables are using on-demand mode.
 *
 * Success is calculated as the percentage of tables that are using on-demand mode
 * vs those which aren't.
 */
export function dynamoDBOnDemandModeFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold } = input;

  const { dynamoDBTables } = input.data;
  const ddbTables = dynamoDBTables || [];

  const tables = withProvisioningStatus(ddbTables);
  const tablesUsingOnDemand = usingOnDemand(tables);

  const percentage = toPercent(tablesUsingOnDemand.length, ddbTables.length);

  const success = moreOrEqual(percentage, threshold);
  const actual =
    `Found ${tables.length} DynamoDB tables, of which ${tablesUsingOnDemand.length} ` +
    `are using on-demand mode): ${value(percentage, '%')}`;

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @param tables
 * @example
 */
function withProvisioningStatus(tables: TableDescription[]) {
  return tables.map((table) => ({
    tableName: table.TableName,
    isOnDemand: table.BillingModeSummary?.BillingMode === 'PAY_PER_REQUEST'
  }));
}

/**
 * @param tables
 * @example
 */
function usingOnDemand(tables: Record<string, any>[]) {
  return tables
    .filter((table) => table.isOnDemand)
    .map((table) => table.tableName);
}
