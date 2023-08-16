import { ArchFitTestName } from '../../interfaces/ArchFitConfiguration';

/**
 * @description Check if the given value is a valid ArchFit test name.
 */
export function isArchFitTestName(value: string): value is ArchFitTestName {
  return [
    'APIGatewayErrorRate',
    'APIGatewayRequestValidation',
    'CustomTaggedResources',
    'SpendTrend',
    'DynamoDBOnDemandMode',
    'DynamoDBProvisionedThroughput',
    'LambdaArchitecture',
    'LambdaDeadLetterQueueUsage',
    'LambdaMemoryCap',
    'LambdaRuntimes',
    'LambdaTimeouts',
    'LambdaVersioning',
    'PublicExposure',
    'RatioServersToServerless'
  ].includes(value);
}
