import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaRuntimesFitnessFunction } from '../../../src/domain/fitness-functions/lambdaRuntimes';

import { createInput } from '../../utils/createInput';

import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';

const name: ArchFitTestName = 'LambdaRuntimes';

const lambdaFunctionsWithMixedRuntimes = JSON.parse(
  JSON.stringify(lambdaFunctions)
);
lambdaFunctionsWithMixedRuntimes[0].Runtime = 'nodejs12.x';

test('It should pass when having no Lambda function data', (t) => {
  const expected = {
    actual: '0.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaRuntimesFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when using Lambda functions with a recent runtime', (t) => {
  const expected = {
    actual: '100.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name, {
    data: { lambdaFunctions }
  });

  const result = lambdaRuntimesFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when expecting half of all Lambda functions to use a recent runtime', (t) => {
  const threshold = 50;

  const expected = {
    actual: '85.71%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithMixedRuntimes }
  });

  const result = lambdaRuntimesFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail when not using all Lambda functions with a recent runtime', (t) => {
  const threshold = 100;

  const expected = {
    actual: '85.71%',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithMixedRuntimes }
  });

  const result = lambdaRuntimesFitnessFunction(input);

  t.deepEqual(result, expected);
});
