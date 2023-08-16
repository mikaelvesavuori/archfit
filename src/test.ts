import { ArchFitConfiguration } from './interfaces/ArchFitConfiguration';

import { createNewArchFit } from './domain/services/ArchFit';

/**
 * @example
 */
async function main() {
  const config: ArchFitConfiguration = {
    region: 'eu-north-1',
    currency: 'EUR',
    period: 30,
    writeReport: false,
    tests: [
      { name: 'APIGatewayErrorRate', threshold: 0 },
      { name: 'APIGatewayRequestValidation', threshold: 0 },
      {
        name: 'CustomTaggedResources',
        threshold: 50,
        required: ['STAGE', 'Usage']
      },
      {
        name: 'SpendTrend',
        threshold: 0
      },
      { name: 'DynamoDBOnDemandMode', threshold: 100 },
      { name: 'DynamoDBProvisionedThroughput', threshold: 5 },
      { name: 'LambdaArchitecture', threshold: 100 },
      { name: 'LambdaDeadLetterQueueUsage', threshold: 100 },
      { name: 'LambdaMemoryCap', threshold: 512 },
      { name: 'LambdaRuntimes', threshold: 100 },
      { name: 'LambdaTimeouts', threshold: 0 },
      { name: 'LambdaVersioning', threshold: 0 },
      { name: 'PublicExposure', threshold: 0 },
      { name: 'RatioServersToServerless', threshold: 0 }
    ]
  };

  const archfit = await createNewArchFit(config);
  const results = archfit.runTests();

  console.log(results);
}

main();
