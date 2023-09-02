import { firstDayOfCurrentMonthShort } from '../../src/infrastructure/utils/time/firstDayOfCurrentMonthShort';
import { shortDateStartOfPeriod } from '../../src/infrastructure/utils/time/shortDateStartOfPeriod';

export const costs = (period: number) => {
  const {
    firstDayOfCurrentMonth,
    firstDayOfPeriod,
    midpointOfPeriod,
    firstDayOfStartPeriod
  } = dates(period);

  return [
    {
      Estimated: false,
      Groups: [],
      TimePeriod: { End: firstDayOfPeriod, Start: firstDayOfCurrentMonth },
      Total: { UnblendedCost: { Amount: '0.3215297413', Unit: 'USD' } }
    },
    {
      Estimated: false,
      Groups: [],
      TimePeriod: { End: firstDayOfPeriod, Start: firstDayOfStartPeriod },
      Total: { UnblendedCost: { Amount: '11.2021013761', Unit: 'USD' } }
    },
    {
      Estimated: true,
      Groups: [],
      TimePeriod: { End: midpointOfPeriod, Start: firstDayOfPeriod },
      Total: { UnblendedCost: { Amount: '3.8697311805', Unit: 'USD' } }
    }
  ];
};

/**
 * @description Returns dates programmatically to ensure testability of date-oriented fitness functions.
 */
function dates(period: number) {
  const firstDayOfCurrentMonth = firstDayOfCurrentMonthShort();
  const firstDayOfPeriod = shortDateStartOfPeriod(period);
  const midpointOfPeriod = firstDayOfPeriod.substring(0, 8) + '15';
  const previousMonth = (() => {
    const month = (parseInt(firstDayOfPeriod.substring(5, 7)) - 1).toString();
    return month.length === 1 ? '0' + month : month;
  })();
  const firstDayOfStartPeriod =
    firstDayOfPeriod.slice(0, 5) + previousMonth + '-01';

  return {
    firstDayOfCurrentMonth,
    firstDayOfPeriod,
    midpointOfPeriod,
    firstDayOfStartPeriod
  };
}
