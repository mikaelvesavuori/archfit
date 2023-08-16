import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { lambdaDeadLetterQueueUsageFitnessFunction } from '../../../src/domain/fitness-functions/lambdaDeadLetterQueueUsage';

import { createInput } from '../../utils/createInput';

import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';

const name: ArchFitTestName = 'LambdaDeadLetterQueueUsage';

test('It should pass when having no Lambda function data', (t) => {
  const expected = {
    actual: '0.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = lambdaDeadLetterQueueUsageFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when Lambda functions have dead letter queues', (t) => {
  const threshold = 100;

  const expected = {
    actual: '100.00%',
    name,
    success: true,
    threshold
  };

  const lambdaFunctionsWithDeadLetterQueues = lambdaFunctions.map(
    (lambdaFunction) => ({
      ...lambdaFunction,
      DeadLetterConfig: {
        TargetArn: 'something'
      }
    })
  );

  const input = createInput(name, {
    threshold,
    data: { lambdaFunctions: lambdaFunctionsWithDeadLetterQueues }
  });

  const result = lambdaDeadLetterQueueUsageFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when not enough Lambda functions have dead letter queues', (t) => {
  const threshold = 100;

  const expected = {
    actual: '0.00%',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, { threshold, data: { lambdaFunctions } });

  const result = lambdaDeadLetterQueueUsageFitnessFunction(input);

  t.deepEqual(result, expected);
});
