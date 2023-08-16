import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { APIGatewayRequestValidationFitnessFunction } from '../../../src/domain/fitness-functions/APIGatewayRequestValidation';

import { createInput } from '../../utils/createInput';

import APIGatewayInstances from '../../../testdata/service/APIGatewayInstances.json';
import APIGatewayRequestValidators from '../../../testdata/service/APIGatewayRequestValidators.json';

const name: ArchFitTestName = 'APIGatewayRequestValidation';

test('It should pass when having no request validators', (t) => {
  const threshold = 0;

  const expected = {
    actual: '0.00%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, { threshold });

  const result = APIGatewayRequestValidationFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when request validator coverage is greater than the threshold', (t) => {
  const threshold = 50;

  const expected = {
    actual: '100.00%',
    name,
    success: true,
    threshold: 50
  };

  const input = createInput(name, {
    threshold,
    data: {
      apiGatewayInstances: APIGatewayInstances,
      apiGatewayRequestValidators: APIGatewayRequestValidators
    }
  });

  const result = APIGatewayRequestValidationFitnessFunction(input);

  t.deepEqual(result, expected);
});
