import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { spendTrendFitnessFunction } from '../../../src/domain/fitness-functions/spendTrend';

import { createInput } from '../../utils/createInput';

import costs from '../../../testdata/service/costs.json';

const name: ArchFitTestName = 'SpendTrend';

test('It should pass when having no spend data', (t) => {
  const expected = {
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  // We need to avoid comparisons with the "actual" value, as it's non-deterministic
  const result: any = spendTrendFitnessFunction(input);
  delete result['actual'];

  t.deepEqual(result, expected);
});

test("It should pass when the predicted value is less than the last month's value plus a threshold (determined as a percentage)", (t) => {
  const threshold = 10;
  const period = 30;

  const expected = {
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    period,
    data: { costs }
  });

  // We need to avoid comparisons with the "actual" value, as it's non-deterministic
  const result: any = spendTrendFitnessFunction(input);
  delete result['actual'];

  t.deepEqual(result, expected);
});
