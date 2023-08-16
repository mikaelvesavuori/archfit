import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { publicExposureFitnessFunction } from '../../../src/domain/fitness-functions/publicExposure';

import { createInput } from '../../utils/createInput';

import publicS3Buckets from '../../../testdata/service/publicS3Buckets.json';
import exposedDatabases from '../../../testdata/service/exposedDatabases.json';

const name: ArchFitTestName = 'PublicExposure';

test('It should pass when having no storage data', (t) => {
  const expected = {
    actual: 'Detected 0 public resources (0 S3 buckets, 0 RDS databases)',
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = publicExposureFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass if fewer than the allowed number of public assets were detected', (t) => {
  const threshold = 5;

  const expected = {
    actual: 'Detected 2 public resources (2 S3 buckets, 0 RDS databases)',
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { publicS3Buckets, exposedDatabases }
  });

  const result = publicExposureFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail if more than the allowed number of public assets were detected', (t) => {
  const threshold = 0;

  const expected = {
    actual: 'Detected 2 public resources (2 S3 buckets, 0 RDS databases)',
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: { publicS3Buckets, exposedDatabases }
  });

  const result = publicExposureFitnessFunction(input);

  t.deepEqual(result, expected);
});
