import { Currency } from './Currency';
import { AWSRegion } from './Region';

/**
 * @description The ArchFit configuration..
 */
export type ArchFitConfiguration = {
  /**
   * @description A list of ArchFit tests to run.
   */
  tests: (ArchFitTest | ArchFitTestConfigurable)[];
  /**
   * @description The AWS region to run the tests in.
   */
  region: AWSRegion;
  /**
   * @description Optional period in days for which to collect data and use in tests.
   * @default 30
   */
  period?: number;
  /**
   * @description Optional AWS-supported currency code.
   * @default USD
   * @see https://repost.aws/knowledge-center/supported-aws-currencies
   */
  currency?: Currency;
  /**
   * @description Optional possibility to write a report to a file named `archfit.results.json`.
   * @default false
   */
  writeReport?: boolean;
};

/**
 * @description The configuration as resolved and settled before running any tests.
 */
export type ArchFitConfigurationResolved = Required<ArchFitConfiguration>;

/**
 * @description Basic ArchFit test definition.
 */
export type ArchFitTest = {
  name: ArchFitTestName;
  threshold?: number;
};

/**
 * @description Extended ArchFit test definition.
 */
export type ArchFitTestConfigurable = ArchFitTest & {
  required: string[];
};

/**
 * @description Valid ArchFit test names.
 */
export type ArchFitTestName =
  | 'APIGatewayErrorRate'
  | 'APIGatewayRequestValidation'
  | 'CustomTaggedResources'
  | 'SpendTrend'
  | 'DynamoDBOnDemandMode'
  | 'DynamoDBProvisionedThroughput'
  | 'LambdaArchitecture'
  | 'LambdaDeadLetterQueueUsage'
  | 'LambdaMemoryCap'
  | 'LambdaRuntimes'
  | 'LambdaTimeouts'
  | 'LambdaVersioning'
  | 'PublicExposure'
  | 'RatioServersToServerless';
