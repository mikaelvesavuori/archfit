import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaTimeoutsFitnessFunction } from '../../../src/domain/fitness-functions/lambdaTimeouts';

import { createInput } from '../../utils/createInput';

import lambdaTimeouts from '../../../testdata/service/lambdaTimeouts.json';

const name: ArchFitTestName = 'LambdaTimeouts';

const actual = [
  {
    functionName: 'step-functions-demo-damages-prod-ValidateInput',
    value: '0.04%'
  },
  {
    functionName: 'step-functions-demo-damages-prod-GetTaxLevel',
    value: '0.93%'
  },
  {
    functionName: 'step-functions-demo-bounty-prod-GetBounties',
    value: '0.16%'
  },
  {
    functionName: 'step-functions-demo-damages-prod-CalculateDamages',
    value: '0.09%'
  },
  {
    functionName: 'step-functions-demo-damages-prod-GetEmperorMood',
    value: '0.10%'
  },
  {
    functionName: 'step-functions-demo-damages-prod-GetRiskScore',
    value: '0.00%'
  },
  {
    functionName: 'step-functions-demo-bounty-prod-AddBounty',
    value: '2.34%'
  }
];

test('It should pass when having no Lambda timeout data', (t) => {
  const expected = {
    actual: [],
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaTimeoutsFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when no single function has timed out more than the threshold value', (t) => {
  const threshold = 5;

  const expected = {
    actual,
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaTimeouts }
  });

  const result = lambdaTimeoutsFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail when any single function has timed out more than the threshold value', (t) => {
  const threshold = 0.5;

  const expected = {
    actual,
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { lambdaTimeouts }
  });

  const result = lambdaTimeoutsFitnessFunction(input);

  t.deepEqual(result, expected);
});
