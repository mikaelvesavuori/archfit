import { ResultByTime } from '@aws-sdk/client-cost-explorer';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { daysInCurrentMonth } from '../../infrastructure/utils/time/daysInCurrentMonth';
import { daysPassedInMonth } from '../../infrastructure/utils/time/daysPassedInMonth';
import { firstDayOfCurrentMonthShort } from '../../infrastructure/utils/time/firstDayOfCurrentMonthShort';
import { lessOrEqual } from '../../infrastructure/utils/math/lessOrEqual';
import { linearExtrapolation } from '../../infrastructure/utils/math/linearExtrapolation';
import { shortDateStartOfPeriod } from '../../infrastructure/utils/time/shortDateStartOfPeriod';
import { toPercent } from '../../infrastructure/utils/string/toPercent';
import { value } from '../../infrastructure/utils/string/value';

/**
 * @description Checks if predicted spend is less than or equal to the threshold.
 * The threshold is calculated as a percentage on top of the last month's spend.
 */
export function spendTrendFitnessFunction(input: FitnessInput): FitnessResult {
  const { name, threshold, period } = input;

  const { costs } = input.data;
  const spend = costs || [];

  const { predictedSpend, comparisonWithThreshold, percent } = calculateValues(
    period,
    threshold,
    spend
  );

  const success = lessOrEqual(predictedSpend, comparisonWithThreshold);
  const actual = `Predicted spend is ${percent} of last month's spend`;

  return {
    name,
    success,
    threshold,
    actual
  };
}

const getCostsData = (startDate: string, costs: ResultByTime[]) => {
  return (
    costs
      ?.filter(
        (resultsByTime: Record<string, any>) =>
          resultsByTime.TimePeriod.Start === startDate
      )
      .map((resultsByTime: Record<string, any>) =>
        parseFloat(resultsByTime.Total.UnblendedCost.Amount)
      )[0] || 0
  );
};

const calculateValues = (
  period: number,
  threshold: number,
  spend: ResultByTime[]
) => {
  const firstDayOfCurrentMonth = firstDayOfCurrentMonthShort();
  const firstDayOfPeriodMonth = shortDateStartOfPeriod(period);

  const predictedSpend = linearExtrapolation(
    getCostsData(firstDayOfCurrentMonth, spend),
    daysPassedInMonth(),
    daysInCurrentMonth()
  );
  const comparisonSpend = getCostsData(firstDayOfPeriodMonth, spend);
  const comparisonWithThreshold =
    comparisonSpend + (comparisonSpend * threshold) / 100;
  const percent = value(
    toPercent(predictedSpend, comparisonWithThreshold),
    '%'
  );

  return {
    predictedSpend,
    comparisonWithThreshold,
    percent
  };
};
