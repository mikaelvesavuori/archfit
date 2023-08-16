import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { dynamoDBOnDemandModeFitnessFunction } from '../../../src/domain/fitness-functions/dynamoDBOnDemandMode';

import { createInput } from '../../utils/createInput';

import dynamoDBTables from '../../../testdata/service/dynamoDBTables.json';

const name: ArchFitTestName = 'DynamoDBOnDemandMode';

test('It should pass when having no DynamoDB tables', (t) => {
  const expected = {
    actual:
      'Found 0 DynamoDB tables, of which 0 are using on-demand mode): 0.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = dynamoDBOnDemandModeFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when having sufficient on-demand mode coverage on DynamoDB tables', (t) => {
  const threshold = 60;

  const expected = {
    actual:
      'Found 4 DynamoDB tables, of which 3 are using on-demand mode): 75.00%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      dynamoDBTables: dynamoDBTables
    }
  });

  const result = dynamoDBOnDemandModeFitnessFunction(input);

  t.deepEqual(result, expected);
});
