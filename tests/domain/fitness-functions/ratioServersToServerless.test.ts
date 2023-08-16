import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { ratioServersToServerlessFitnessFunction } from '../../../src/domain/fitness-functions/ratioServersToServerless';

import { createInput } from '../../utils/createInput';

import ec2Instances from '../../../testdata/service/ec2Instances.json';
import lambdaFunctions from '../../../testdata/service/lambdaFunctions.json';
import fargateTasks from '../../../testdata/service/fargateTasks.json';

const name: ArchFitTestName = 'RatioServersToServerless';

test('It should pass when missing all required data', (t) => {
  const expected = {
    actual: '0.00% servers-to-serverless',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = ratioServersToServerlessFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass if the ratio of servers-to-serverless is under the allowed threshold', (t) => {
  const threshold = 20;

  const expected = {
    actual: '14.29% servers-to-serverless',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      ec2Instances,
      lambdaFunctions,
      fargateTasks
    }
  });

  const result = ratioServersToServerlessFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail if the ratio of servers-to-serverless is over the allowed threshold', (t) => {
  const threshold = 10;

  const expected = {
    actual: '14.29% servers-to-serverless',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      ec2Instances,
      lambdaFunctions,
      fargateTasks
    }
  });

  const result = ratioServersToServerlessFitnessFunction(input);

  t.deepEqual(result, expected);
});
