import { GetMetricDataCommand } from '@aws-sdk/client-cloudwatch';

import { pastDate } from '../utils/time/pastDate';
import { daysToSeconds } from '../utils/time/daysToSeconds';
import { InvalidMetricDataQuery } from '../../errors/InvalidMetricDataQuery';

/**
 * @description Creates a GetMetricDataCommand with the given queries and period.
 */
export function createMetricDataCommand(
  queries: string[],
  period: number,
  id?: string
) {
  return new GetMetricDataCommand({
    // @ts-ignore
    MetricDataQueries: [...getQueries(queries, daysToSeconds(period), id)],
    StartTime: pastDate(period),
    EndTime: new Date()
  });
}

/**
 * @param queries
 * @param functionName
 * @param period
 * @param id
 * @example
 */
function getQueries(queries: string[], period: number, id: string) {
  if (queries.length === 0) return [];

  return queries.map((query) => {
    switch (query) {
      // Lambda
      case 'invocations':
        return invocations(id, period);
      case 'timeouts':
        return timeouts(id, period);
      // API Gateway
      case 'clientErrors':
        return clientErrors(id, period);
      case 'serverErrors':
        return serverErrors(id, period);
      // DynamoDB
      case 'readCapacityUtilization':
        return dynamoDBReadCapacityUtilization(id, period);
      case 'writeCapacityUtilization':
        return dynamoDBWriteCapacityUtilization(id, period);
      // Fallback
      default:
        throw new InvalidMetricDataQuery(query);
    }
  });
}

const invocations = (functionName: string, period: number) => ({
  Id: 'invocations',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/Lambda',
      MetricName: 'Invocations',
      Dimensions: [{ Name: 'FunctionName', Value: functionName }]
    },
    Period: period,
    Stat: 'SampleCount'
  },
  ReturnData: true
});

const timeouts = (functionName: string, period: number) => ({
  Id: 'timeouts',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/Lambda',
      MetricName: 'Timeouts',
      Dimensions: [{ Name: 'FunctionName', Value: functionName }]
    },
    Period: period,
    Stat: 'SampleCount'
  },
  ReturnData: true
});

const serverErrors = (instanceId: string, period: number) => ({
  Id: 'serverErrors',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/ApiGateway',
      MetricName: '5XXError',
      Dimensions: [{ Name: 'ApiName', Value: instanceId }]
    },
    Period: period,
    Stat: 'Sum'
  },
  ReturnData: true
});

const clientErrors = (instanceId: string, period: number) => ({
  Id: 'clientErrors',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/ApiGateway',
      MetricName: '4XXError',
      Dimensions: [{ Name: 'ApiName', Value: instanceId }]
    },
    Period: period,
    Stat: 'Sum'
  },
  ReturnData: true
});

const dynamoDBReadCapacityUtilization = (
  tableName: string,
  period: number
) => ({
  Id: 'readCapacityUtilization',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/DynamoDB',
      MetricName: 'ConsumedReadCapacityUnits',
      Dimensions: [
        {
          Name: 'TableName',
          Value: tableName
        }
      ]
    },
    Period: period,
    Stat: 'Maximum'
  }
});

const dynamoDBWriteCapacityUtilization = (
  tableName: string,
  period: number
) => ({
  Id: 'writeCapacityUtilization',
  MetricStat: {
    Metric: {
      Namespace: 'AWS/DynamoDB',
      MetricName: 'ConsumedReadCapacityUnits',
      Dimensions: [
        {
          Name: 'TableName',
          Value: tableName
        }
      ]
    },
    Period: period,
    Stat: 'Maximum'
  }
});
