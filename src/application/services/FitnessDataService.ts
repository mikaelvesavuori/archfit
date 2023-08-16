import {
  ArchFitTest,
  ArchFitTestName
} from '../../interfaces/ArchFitConfiguration';
import { ArchFitData } from '../../interfaces/ArchFitData';
import { DataService } from '../../interfaces/DataService';
import { DataStore } from '../../interfaces/DataStore';

import { createNewFitnessDataStore } from './FitnessDataStore';

import { getAPIGatewayErrorRate } from '../../infrastructure/aws/getAPIGatewayErrorRate';
import { getAPIGatewayRequestValidators } from '../../infrastructure/aws/getAPIGatewayRequestValidators';
import { getAPIGatewayRESTInstances } from '../../infrastructure/aws/getAPIGatewayRESTInstances';
import { getDynamoDBTableInfo } from '../../infrastructure/aws/getDynamoDBTableInfo';
import { getDynamoDBTableNames } from '../../infrastructure/aws/getDynamoDBTableNames';
import { getDynamoDBUtilization } from '../../infrastructure/aws/getDynamoDBUtilization';
import { getEC2Instances } from '../../infrastructure/aws/getEC2Instances';
import { getExposedDatabases } from '../../infrastructure/aws/getExposedDatabases';
import { getFargateTasks } from '../../infrastructure/aws/getFargateTasks';
import { getLambdaFunctions } from '../../infrastructure/aws/getLambdaFunctions';
import { getLambdaTimeouts } from '../../infrastructure/aws/getLambdaTimeouts';
import { getPublicS3Buckets } from '../../infrastructure/aws/getPublicS3Buckets';
import { getSpend } from '../../infrastructure/aws/getSpend';
import { getTaggedResources } from '../../infrastructure/aws/getTaggedResources';

import { isArchFitTestName } from '../utils/isArchFitTestName';

/**
 * @description Factory function to vend a new data service.
 */
export async function createNewFitnessDataService(
  region: string,
  tests: ArchFitTest[],
  period: number
) {
  const dataStore = createNewFitnessDataStore();
  return new FitnessDataService(region, tests, period, dataStore);
}

/**
 * @description The data service takes care of taking in all of the
 * data needed to generate an ArchFit report.
 */
class FitnessDataService implements DataService {
  private readonly region: string;
  private readonly tests: ArchFitTest[];
  private readonly period: number;
  private readonly dataStore: DataStore;

  constructor(
    region: string,
    tests: ArchFitTest[],
    period: number,
    dataStore: DataStore
  ) {
    this.region = region;
    this.tests = tests;
    this.period = period;
    this.dataStore = dataStore;
  }

  private filteredTestNames() {
    if (this.tests?.length > 0)
      return this.tests
        .filter((test) => isArchFitTestName(test.name))
        .map((test) => test.name);
    return [];
  }

  private hasTest(value: string) {
    return this.filteredTestNames().includes(value as ArchFitTestName);
  }

  /**
   * @description Orchestrates the data gathering for all the
   * high-level operations.
   */
  public async getData() {
    const region = this.region;
    const period = this.period;

    await this.getDataForAPIGateway(region, period);
    await this.getDataForDynamoDB(region, period);
    await this.getDataForLambda(region, period);
    await this.getDataForS3(region);
    await this.getDataForBilling(region, period);
    await this.getOtherData(region);

    return this.dataStore.getData() as ArchFitData;
  }

  private async getDataForAPIGateway(region: string, period: number) {
    if (
      (this.hasTest('APIGatewayErrorRate') ||
        this.hasTest('APIGatewayRequestValidation')) &&
      !this.dataStore.hasData('apiGatewayInstances')
    )
      this.dataStore.store(
        'apiGatewayInstances',
        await getAPIGatewayRESTInstances(region)
      );

    if (
      this.hasTest('APIGatewayErrorRate') &&
      !this.dataStore.hasData('errorRates')
    )
      this.dataStore.store(
        'errorRates',
        await getAPIGatewayErrorRate(
          region,
          period,
          this.dataStore.getData('apiGatewayInstances') as any
        )
      );

    if (
      this.hasTest('APIGatewayRequestValidation') &&
      !this.dataStore.hasData('apiGatewayRequestValidators')
    )
      this.dataStore.store(
        'apiGatewayRequestValidators',
        await getAPIGatewayRequestValidators(
          region,
          this.dataStore.getData('apiGatewayInstances') as any
        )
      );
  }

  private async getDataForDynamoDB(region: string, period: number) {
    if (
      this.hasTest('DynamoDBOnDemandMode') ||
      this.hasTest('DynamoDBProvisionedThroughput')
    ) {
      if (!this.dataStore.hasData('dynamoDBTableNames'))
        this.dataStore.store(
          'dynamoDBTableNames',
          await getDynamoDBTableNames(region)
        );

      if (!this.dataStore.hasData('dynamoDBTables'))
        this.dataStore.store(
          'dynamoDBTables',
          await getDynamoDBTableInfo(
            region,
            this.dataStore.getData('dynamoDBTableNames') as any
          )
        );
    }

    if (this.hasTest('DynamoDBProvisionedThroughput')) {
      this.dataStore.store(
        'dynamoDBMaxUtilization',
        await getDynamoDBUtilization(
          region,
          period,
          this.dataStore.getData('dynamoDBTableNames') as any
        )
      );
    }
  }

  private async getDataForLambda(region: string, period: number) {
    if (
      (this.hasTest('LambdaArchitecture') ||
        this.hasTest('LambdaDeadLetterQueueUsage') ||
        this.hasTest('LambdaMemoryCap') ||
        this.hasTest('LambdaRuntimes') ||
        this.hasTest('LambdaTimeouts') ||
        this.hasTest('LambdaVersioning')) &&
      !this.dataStore.hasData('lambdaFunctions')
    )
      this.dataStore.store('lambdaFunctions', await getLambdaFunctions(region));

    if (
      this.hasTest('LambdaTimeouts') &&
      !this.dataStore.hasData('LambdaTimeouts')
    ) {
      this.dataStore.store(
        'lambdaTimeouts',
        await getLambdaTimeouts(
          region,
          period,
          this.dataStore.getData('lambdaFunctions') as any
        )
      );
    }
  }

  private async getDataForS3(region: string) {
    if (
      (this.hasTest('PublicExposure') || this.hasTest('PublicExposure')) &&
      !this.dataStore.hasData('exposedDatabases') &&
      !this.dataStore.hasData('publicS3Buckets')
    ) {
      this.dataStore.store(
        'exposedDatabases',
        await getExposedDatabases(region)
      );
      this.dataStore.store('publicS3Buckets', await getPublicS3Buckets(region));
    }
  }

  private async getDataForBilling(region: string, period: number) {
    if (this.hasTest('SpendTrend') && !this.dataStore.hasData('costs')) {
      this.dataStore.store('costs', await getSpend(region, period));
    }
  }

  private async getOtherData(region: string) {
    if (this.hasTest('RatioServersToServerless')) {
      if (!this.dataStore.hasData('ec2Instances'))
        this.dataStore.store('ec2Instances', await getEC2Instances(region));
      if (!this.dataStore.hasData('fargateTasks'))
        this.dataStore.store('fargateTasks', await getFargateTasks(region));
      if (!this.dataStore.hasData('lambdaFunctions'))
        this.dataStore.store(
          'lambdaFunctions',
          await getLambdaFunctions(region)
        );
    }

    if (
      this.hasTest('CustomTaggedResources') &&
      !this.dataStore.hasData('taggedResources')
    ) {
      this.dataStore.store('taggedResources', await getTaggedResources(region));
    }
  }
}
