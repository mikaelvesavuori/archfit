import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaArchitectureFitnessFunction } from '../../../src/domain/fitness-functions/lambdaArchitecture';

import { createInput } from '../../utils/createInput';

import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';

const name: ArchFitTestName = 'LambdaArchitecture';

const lambdaFunctionsWithMixedArchitectures = JSON.parse(
  JSON.stringify(lambdaFunctions)
);
lambdaFunctionsWithMixedArchitectures[0].Architectures[0] = 'x86_64';

test('It should pass when having no Lambda function data', (t) => {
  const expected = {
    actual: '0.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaArchitectureFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when Lambda functions are using ARM architecture', (t) => {
  const threshold = 100;

  const expected = {
    actual: '100.00%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions }
  });

  const result = lambdaArchitectureFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when expecting half of all Lambda functions to use ARM architecture', (t) => {
  const threshold = 50;

  const expected = {
    actual: '85.71%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithMixedArchitectures }
  });

  const result = lambdaArchitectureFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail when not using all Lambda functions with ARM architecture', (t) => {
  const threshold = 100;

  const expected = {
    actual: '85.71%',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithMixedArchitectures }
  });

  const result = lambdaArchitectureFitnessFunction(input);

  t.deepEqual(result, expected);
});
