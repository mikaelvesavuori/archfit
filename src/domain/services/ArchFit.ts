import {
  ArchFitConfiguration,
  ArchFitConfigurationResolved,
  ArchFitTest,
  ArchFitTestConfigurable,
  ArchFitTestName
} from '../../interfaces/ArchFitConfiguration';
import { FitnessInput } from '../../interfaces/FitnessInput';
import { ArchFitData } from '../../interfaces/ArchFitData';
import { Currency } from '../../interfaces/Currency';

import { createNewFitnessDataService } from '../../application/services/FitnessDataService';
import { isArchFitTestName } from '../../application/utils/isArchFitTestName';
import { isCurrency } from '../../application/utils/isCurrency';

import { APIGatewayErrorRateFitnessFunction } from '../fitness-functions/APIGatewayErrorRate';
import { APIGatewayRequestValidationFitnessFunction } from '../fitness-functions/APIGatewayRequestValidation';
import { customTaggedResourcesFitnessFunction } from '../fitness-functions/customTaggedResources';
import { dynamoDBOnDemandModeFitnessFunction } from '../fitness-functions/dynamoDBOnDemandMode';
import { dynamoDBProvisionedThroughputFitnessFunction } from '../fitness-functions/dynamoDBProvisionedThroughput';
import { lambdaArchitectureFitnessFunction } from '../fitness-functions/lambdaArchitecture';
import { lambdaDeadLetterQueueUsageFitnessFunction } from '../fitness-functions/lambdaDeadLetterQueueUsage';
import { lambdaMemoryCapFitnessFunction } from '../fitness-functions/lambdaMemoryCap';
import { lambdaRuntimesFitnessFunction } from '../fitness-functions/lambdaRuntimes';
import { lambdaTimeoutsFitnessFunction } from '../fitness-functions/lambdaTimeouts';
import { lambdaVersioningFitnessFunction } from '../fitness-functions/lambdaVersioning';
import { publicExposureFitnessFunction } from '../fitness-functions/publicExposure';
import { ratioServersToServerlessFitnessFunction } from '../fitness-functions/ratioServersToServerless';
import { spendTrendFitnessFunction } from '../fitness-functions/spendTrend';

import { writeFile } from '../../infrastructure/utils/io/writeFile';

import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError';
import { InvalidPeriodError } from '../../errors/InvalidPeriodError';
import { InvalidTestsError } from '../../errors/InvalidTestsError';
import { InvalidWriteReportOptionError } from '../../errors/InvalidReportOptionError';
import { MissingConfigurationError } from '../../errors/MissingConfigurationError';
import { MissingDataError } from '../../errors/MissingDateError';
import { MissingRegionError } from '../../errors/MissingRegionError';

/**
 * @description Factory function to create an ArchFit instance.
 * This will also create a data service that will pre-fetch all the data needed.
 * @param config - ArchFit configuration object.
 * @returns An ArchFit instance with the data set.
 */
export async function createNewArchFit(config: ArchFitConfiguration) {
  const archfit = new ArchFit(config);
  const { region, tests, period } = archfit.getConfig();

  const dataService = await createNewFitnessDataService(region, tests, period);
  const data = await dataService.getData();

  archfit.setData(data);

  return archfit;
}

/**
 * @description ArchFit is a utility tool that will run a series of
 * fitness functions ("tests") against your AWS resources.
 */
class ArchFit {
  private readonly config: ArchFitConfigurationResolved;
  private data: ArchFitData = {};

  fallbackCurrency: Currency = 'USD';
  fallbackPeriod = 30;

  resultsFileName = 'archfit-results.json';

  constructor(config: ArchFitConfiguration) {
    if (!config) throw new MissingConfigurationError();
    this.config = this.validateConfig(config);
  }

  /**
   * @description Set the data for the ArchFit instance, collected
   * by the data service.
   * @param data - The data to set for the ArchFit instance..
   * @throws [MissingDataError].
   */
  public setData(data: ArchFitData) {
    if (!data) throw new MissingDataError();
    this.data = data;
  }

  /**
   * @description Return the ArchFit configuration.
   */
  public getConfig() {
    return this.config;
  }

  private validateConfig(config: ArchFitConfiguration) {
    this.validateTests(config);
    this.validateRegion(config);
    this.validatePeriod(config);
    this.validateCurrency(config);
    this.validateReport(config);

    const tests = config.tests.filter((test: ArchFitTest) =>
      isArchFitTestName(test.name)
    );

    const validatedConfig = {
      tests,
      region: config.region,
      currency: config.currency || this.fallbackCurrency,
      period: config.period || this.fallbackPeriod,
      writeReport: !!config.writeReport
    };

    console.log('Configuration:', validatedConfig);
    return validatedConfig;
  }

  private validateTests(config: ArchFitConfiguration) {
    if (!config.tests || !Array.isArray(config.tests))
      throw new InvalidTestsError();
  }

  private validateRegion(config: ArchFitConfiguration) {
    if (!config.region) throw new MissingRegionError();
  }

  private validatePeriod(config: ArchFitConfiguration) {
    if (config.period && typeof config.period !== 'number')
      throw new InvalidPeriodError();
  }

  private validateCurrency(config: ArchFitConfiguration) {
    if (config.currency && !isCurrency(config.currency))
      throw new InvalidCurrencyError();
  }

  private validateReport(config: ArchFitConfiguration) {
    if (
      config.writeReport !== undefined &&
      typeof config?.writeReport !== 'boolean'
    )
      throw new InvalidWriteReportOptionError();
  }

  /**
   * @description Orchestrate the running of all fitness functions ("tests").
   */
  public runTests() {
    const results: FitnessInput[] = this.config.tests.map(
      (test: ArchFitTest) => {
        const configurableTest = test as ArchFitTestConfigurable;

        const testToRun = this.getTest(test.name);

        return testToRun(
          configurableTest.name,
          configurableTest.threshold || 0,
          configurableTest.required || []
        );
      }
    );

    if (this.config.writeReport) writeFile(this.resultsFileName, results);

    return results;
  }

  /* eslint-disable max-lines-per-function */
  private getTest(key: ArchFitTestName) {
    const input: Record<string, any> = {
      data: this.data,
      region: this.config.region,
      period: this.config.period
    };

    const tests: Record<string, any> = {
      APIGatewayErrorRate: (name: ArchFitTestName, threshold: number) =>
        APIGatewayErrorRateFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      APIGatewayRequestValidation: (name: ArchFitTestName, threshold: number) =>
        APIGatewayRequestValidationFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      CustomTaggedResources: (
        name: ArchFitTestName,
        threshold: number,
        required: string[]
      ) =>
        customTaggedResourcesFitnessFunction({
          ...input,
          name,
          threshold,
          required
        } as FitnessInput),
      SpendTrend: (name: ArchFitTestName, threshold: number) =>
        spendTrendFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      DynamoDBOnDemandMode: (name: ArchFitTestName, threshold: number) =>
        dynamoDBOnDemandModeFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      DynamoDBProvisionedThroughput: (
        name: ArchFitTestName,
        threshold: number
      ) =>
        dynamoDBProvisionedThroughputFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaArchitecture: (name: ArchFitTestName, threshold: number) =>
        lambdaArchitectureFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaDeadLetterQueueUsage: (name: ArchFitTestName, threshold: number) =>
        lambdaDeadLetterQueueUsageFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaMemoryCap: (name: ArchFitTestName, threshold: number) =>
        lambdaMemoryCapFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaRuntimes: (name: ArchFitTestName, threshold: number) =>
        lambdaRuntimesFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaTimeouts: (name: ArchFitTestName, threshold: number) =>
        lambdaTimeoutsFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      LambdaVersioning: (name: ArchFitTestName, threshold: number) =>
        lambdaVersioningFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      PublicExposure: (name: ArchFitTestName, threshold: number) =>
        publicExposureFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput),
      RatioServersToServerless: (name: ArchFitTestName, threshold: number) =>
        ratioServersToServerlessFitnessFunction({
          ...input,
          name,
          threshold
        } as FitnessInput)
    };

    return tests[key];
  }
  /* eslint-enable max-lines-per-function */
}
