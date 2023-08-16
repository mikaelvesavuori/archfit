import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { customTaggedResourcesFitnessFunction } from '../../../src/domain/fitness-functions/customTaggedResources';

import { createInput } from '../../utils/createInput';

import taggedResources from '../../../testdata/service/taggedResources.json';

const name: ArchFitTestName = 'CustomTaggedResources';

test('It should pass when having no tagged resources', (t) => {
  const threshold = 0;

  const expected = {
    actual: '0.00%',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name, { threshold });

  const result = customTaggedResourcesFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when having tagged resources coverage over the threshold value', (t) => {
  const threshold = 60;

  const expected = {
    actual: '70.00%',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      taggedResources: taggedResources
    },
    required: ['STAGE', 'Usage']
  });

  const result = customTaggedResourcesFitnessFunction(input);

  t.deepEqual(result, expected);
});
