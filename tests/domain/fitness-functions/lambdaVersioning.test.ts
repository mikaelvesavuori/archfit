import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaVersioningFitnessFunction } from '../../../src/domain/fitness-functions/lambdaVersioning';

import { createInput } from '../../utils/createInput';

import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';

const name: ArchFitTestName = 'LambdaVersioning';

test('It should pass when having no Lambda function data', (t) => {
  const expected = {
    actual: 'Versioning is used in 0/0 functions (0%)',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaVersioningFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when expecting no Lambda functions to have versioning enabled', (t) => {
  const threshold = 0;

  const expected = {
    actual: 'Versioning is used in 0/7 functions (0%)',
    name: 'LambdaVersioning',
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions }
  });

  const result = lambdaVersioningFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when expecting all Lambda functions to have versioning enabled', (t) => {
  const threshold = 100;

  const expected = {
    actual:
      'Versioning is used in 7/7 functions (100%): step-functions-demo-damages-prod-ValidateInput,step-functions-demo-damages-prod-GetTaxLevel,step-functions-demo-bounty-prod-GetBounties,step-functions-demo-damages-prod-CalculateDamages,step-functions-demo-damages-prod-GetEmperorMood,step-functions-demo-damages-prod-GetRiskScore,step-functions-demo-bounty-prod-AddBounty',
    name: 'LambdaVersioning',
    success: true,
    threshold
  };

  const lambdaFunctionsWithVersioning = lambdaFunctions.map(
    (lambdaFunction) => {
      return {
        ...lambdaFunction,
        Version: '2'
      };
    }
  );

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithVersioning }
  });

  const result = lambdaVersioningFitnessFunction(input);

  t.deepEqual(result, expected);
});
