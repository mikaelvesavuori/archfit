import test from 'ava';

import { ArchFitTestName } from '../../../src/interfaces/ArchFitConfiguration';

import { dynamoDBProvisionedThroughputFitnessFunction } from '../../../src/domain/fitness-functions/dynamoDBProvisionedThroughput';

import { createInput } from '../../utils/createInput';

import dynamoDBTables from '../../../testdata/service/dynamoDBTables.json';
import dynamoDBMaxUtilization from '../../../testdata/service/dynamoDBMaxUtilization.json';

const name: ArchFitTestName = 'DynamoDBProvisionedThroughput';

test('It should pass when having no DynamoDB tables or throughput data', (t) => {
  const expected = {
    actual: {
      success: true
    },
    name,
    success: true,
    threshold: 0
  };

  const input = createInput(name);

  const result = dynamoDBProvisionedThroughputFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass through if missing utilization data', (t) => {
  const threshold = 20;

  const expected = {
    actual: {
      success: true
    },
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

  const result = dynamoDBProvisionedThroughputFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should pass when capacity is within the threshold', (t) => {
  const threshold = 20;

  const expected = {
    actual: {
      SomeDemoTable: {
        readWithinTolerance: true,
        writeWithinTolerance: true
      },
      success: true
    },
    name,
    success: true,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      dynamoDBMaxUtilization: {
        SomeDemoTable: {
          readCapacityUtilization: 5,
          writeCapacityUtilization: 2
        }
      },
      dynamoDBTables: dynamoDBTables
    }
  });

  const result = dynamoDBProvisionedThroughputFitnessFunction(input);

  t.deepEqual(result, expected);
});

test('It should fail when capacity is above or below the tolerable threshold', (t) => {
  const threshold = 20;

  const expected = {
    actual: {
      SomeDemoTable: {
        readWithinTolerance: false,
        writeWithinTolerance: false
      },
      success: false
    },
    name,
    success: false,
    threshold
  };

  const input = createInput(name, {
    threshold,
    data: {
      dynamoDBMaxUtilization: dynamoDBMaxUtilization,
      dynamoDBTables: dynamoDBTables
    }
  });

  const result = dynamoDBProvisionedThroughputFitnessFunction(input);

  t.deepEqual(result, expected);
});
