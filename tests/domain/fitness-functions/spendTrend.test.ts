import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { spendTrendFitnessFunction } from '../../../src/domain/fitness-functions/spendTrend';

import { createInput } from '../../utils/createInput';

import { costs } from '../../../testdata/service/costs';

const name: ArchFitTestName = 'SpendTrend';

test('It should pass when having no spend data', (t) => {
  const expected = {
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result: any = spendTrendFitnessFunction(input);
  delete result['actual'];

  t.deepEqual(result, expected);
});

test("It should pass when the predicted value is less than the last month's value plus a threshold (determined as a percentage)", (t) => {
  const threshold = 100000;
  const period = 30;

  const expected = {
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    period,
    data: { costs: costs(period) }
  });

  const result: any = spendTrendFitnessFunction(input);
  delete result['actual'];

  t.deepEqual(result, expected);
});

test("It should fail when the predicted value more than the last month's value plus a threshold (determined as a percentage)", (t) => {
  const threshold = 0;
  const period = 30;

  const expected = {
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    period,
    data: { costs: costs(period) }
  });

  const result: any = spendTrendFitnessFunction(input);
  delete result['actual'];

  t.deepEqual(result, expected);
});
