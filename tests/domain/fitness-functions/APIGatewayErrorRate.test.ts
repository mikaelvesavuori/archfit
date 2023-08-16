import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { APIGatewayErrorRateFitnessFunction } from '../../../src/domain/fitness-functions/APIGatewayErrorRate';

import { createInput } from '../../utils/createInput';

import APIGatewayErrorRate from '../../../testdata/service/APIGatewayErrorRate.json';

const name: ArchFitTestName = 'APIGatewayErrorRate';

test('It should pass when having no error data', (t) => {
  const expected = {
    actual: [],
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = APIGatewayErrorRateFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when having errors under the threshold', (t) => {
  const expected = {
    actual: [
      {
        dailyAverageErrorRate: '0.00%',
        id: 'axaxa12345',
        success: true
      }
    ],
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name, {
    data: {
      errorRates: [
        {
          id: 'axaxa12345',
          invocationsCount: 0,
          totalErrors: 0,
          serverErrors: 0,
          clientErrors: 0
        }
      ] as any
    }
  });

  const result = APIGatewayErrorRateFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should not pass when having errors over the threshold', (t) => {
  const threshold = 5;

  const expected = {
    actual: [
      {
        dailyAverageErrorRate: '9.80%',
        id: 'axaxa12345',
        success: false
      }
    ],
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { errorRates: APIGatewayErrorRate }
  });

  const result = APIGatewayErrorRateFitnessFunction(input);

  t.deepEqual(result, expected);
});
