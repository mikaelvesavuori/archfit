import { RestApi } from '@aws-sdk/client-api-gateway';
import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';

import { APIGatewayErrorRates } from '../../interfaces/APIGatewayErrorRates';

import { createMetricDataCommand } from './createMetricDataCommand';

/**
 * @description Get the total number of client and server errors from API Gateway for a period.
 */
export async function getAPIGatewayErrorRate(
  region: string,
  period: number,
  instances: RestApi[]
): Promise<APIGatewayErrorRates[]> {
  const client = new CloudWatchClient({ region });

  const timeouts: APIGatewayErrorRates[] = [];

  for await (const instance of instances) {
    const { id, invocationsCount, totalErrors, serverErrors, clientErrors } =
      await getCounts(client, period, instance.id || '');

    timeouts.push({
      id,
      invocationsCount,
      totalErrors,
      serverErrors,
      clientErrors
    });
  }

  return timeouts;
}

/**
 * @description Get the invocations and error counts for a Lambda function.
 */
async function getCounts(
  client: CloudWatchClient,
  period: number,
  id: string
): Promise<APIGatewayErrorRates> {
  const getMetricDataCommand = createMetricDataCommand(
    ['invocations', 'clientErrors', 'serverErrors'],
    period,
    id
  );

  const getMetricDataResponse = await client.send(getMetricDataCommand);

  const invocationsCount =
    getMetricDataResponse.MetricDataResults?.[0].Values?.[0] || 0;

  const serverErrors =
    getMetricDataResponse.MetricDataResults?.[1].Values?.[0] || 0;

  const clientErrors =
    getMetricDataResponse.MetricDataResults?.[2].Values?.[0] || 0;

  return {
    id,
    invocationsCount,
    totalErrors: serverErrors + clientErrors,
    serverErrors,
    clientErrors
  };
}
