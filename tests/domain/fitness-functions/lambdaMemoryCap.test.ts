import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaMemoryCapFitnessFunction } from '../../../src/domain/fitness-functions/lambdaMemoryCap';

import { createInput } from '../../utils/createInput';

import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';

const name: ArchFitTestName = 'LambdaMemoryCap';

test('It should pass when having no Lambda function data', (t) => {
  const expected = {
    actual: 'Found 0 oversized functions (over 0 MB)',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaMemoryCapFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when no functions are oversized', (t) => {
  const threshold = 2048;

  const expected = {
    actual: 'Found 0 oversized functions (over 2048 MB)',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, { threshold, data: { lambdaFunctions } });

  const result = lambdaMemoryCapFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail when any function is oversized', (t) => {
  const threshold = 512;

  const expected = {
    actual: 'Found 7 oversized functions (over 512 MB)',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, { threshold, data: { lambdaFunctions } });

  const result = lambdaMemoryCapFitnessFunction(input);

  t.deepEqual(result, expected);
});
