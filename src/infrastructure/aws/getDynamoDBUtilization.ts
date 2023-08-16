import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';

import { DynamoDBCapacityUtilization } from '../../interfaces/DynamoDBCapacityUtilization';

import { createMetricDataCommand } from './createMetricDataCommand';

/**
 * @description Get DynamoDB utilization for a given period and list of tables.
 */
export async function getDynamoDBUtilization(
  region: string,
  period: number,
  tables: string[]
): Promise<DynamoDBCapacityUtilization> {
  const client = new CloudWatchClient({ region });

  const utilization: DynamoDBCapacityUtilization = {};

  for await (const table of tables) {
    const getMetricDataCommand = createMetricDataCommand(
      ['readCapacityUtilization', 'writeCapacityUtilization'],
      period,
      table
    );

    const response = await client.send(getMetricDataCommand);

    const readCapacityUtilization =
      response.MetricDataResults?.[0].Values?.[0] || 0;
    const writeCapacityUtilization =
      response.MetricDataResults?.[1].Values?.[0] || 0;

    utilization[table] = {
      readCapacityUtilization,
      writeCapacityUtilization
    };
  }

  return utilization;
}
