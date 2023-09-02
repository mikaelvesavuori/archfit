import test from 'ava';

import { linearExtrapolation } from '../../../../src/infrastructure/utils/math/linearExtrapolation';

test('It should handle divisions by zero, by falling back to the provided amount', (t) => {
  const expected = 1000;

  const result: any = linearExtrapolation(10, 0, 100);

  t.is(result, expected);
});

test('It should linearly extrapolate integer values', (t) => {
  const expected = 1000;

  const result: any = linearExtrapolation(10, 1, 100);

  t.is(result, expected);
});

test('It should linearly extrapolate float values', (t) => {
  const expected = 28.938761888258334;

  const result: any = linearExtrapolation(11.2021013761, 12, 31);

  t.is(result, expected);
});
