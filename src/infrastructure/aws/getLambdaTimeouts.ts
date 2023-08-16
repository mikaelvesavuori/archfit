import { CloudWatchClient } from '@aws-sdk/client-cloudwatch';
import { FunctionConfiguration } from '@aws-sdk/client-lambda';

import { LambdaCounts } from '../../interfaces/LambdaCounts';
import { LambdaTimeout } from '../../interfaces/LambdaTimeout';

import { createMetricDataCommand } from '../aws/createMetricDataCommand';
import { reduceToValue } from '../utils/string/reduceToValue';

/**
 * @description Get the invocations and timeouts counts for all Lambda functions.
 */
export async function getLambdaTimeouts(
  region: string,
  period: number,
  lambdaFunctions: FunctionConfiguration[]
): Promise<LambdaTimeout[]> {
  const client = new CloudWatchClient({ region });

  const timeouts: LambdaTimeout[] = [];

  for await (const lambdaFunction of lambdaFunctions) {
    const { invocationsCount, timeoutsCount } = await getCounts(
      client,
      period,
      lambdaFunction
    );

    timeouts.push({
      functionName: lambdaFunction.FunctionName as string,
      invocationsCount,
      timeoutsCount
    });
  }

  return timeouts;
}

/**
 * @description Get the invocations and timeouts counts for a Lambda function.
 */
async function getCounts(
  client: CloudWatchClient,
  period: number,
  lambdaFunction: FunctionConfiguration
): Promise<LambdaCounts> {
  const functionName = lambdaFunction.FunctionName || '';

  const metricDataResponse = await client.send(
    createMetricDataCommand(['invocations', 'timeouts'], period, functionName)
  );

  const invocationsCount = reduceToValue(
    metricDataResponse.MetricDataResults?.[0]?.Values
  );

  const timeoutsCount = reduceToValue(
    metricDataResponse.MetricDataResults?.[1]?.Values
  );

  return { invocationsCount, timeoutsCount };
}
