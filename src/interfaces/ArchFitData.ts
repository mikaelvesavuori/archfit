import { FunctionConfiguration } from '@aws-sdk/client-lambda';
import { RequestValidator, RestApi } from '@aws-sdk/client-api-gateway';
import { Reservation } from '@aws-sdk/client-ec2';
import { ResourceTagMapping } from '@aws-sdk/client-resource-groups-tagging-api';
import { ResultByTime } from '@aws-sdk/client-cost-explorer';
import { TableDescription } from '@aws-sdk/client-dynamodb';

import { APIGatewayErrorRates } from './APIGatewayErrorRates';
import { DynamoDBCapacityUtilization } from './DynamoDBCapacityUtilization';
import { LambdaTimeout } from './LambdaTimeout';

/**
 * @description Data available for fitness functions to run.
 */
export type ArchFitData = {
  apiGatewayInstances?: RestApi[];
  apiGatewayRequestValidators?: RequestValidator[];
  costs?: ResultByTime[];
  dynamoDBMaxUtilization?: DynamoDBCapacityUtilization;
  dynamoDBTableNames?: string[];
  dynamoDBTables?: TableDescription[];
  ec2Instances?: Reservation[];
  errorRates?: APIGatewayErrorRates[];
  exposedDatabases?: string[];
  fargateTasks?: string[];
  lambdaFunctions?: FunctionConfiguration[];
  lambdaTimeouts?: LambdaTimeout[];
  publicS3Buckets?: string[];
  taggedResources?: ResourceTagMapping[];
};
