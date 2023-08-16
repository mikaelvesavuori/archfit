import {
  CostExplorerClient,
  GetCostAndUsageCommand,
  ResultByTime
} from '@aws-sdk/client-cost-explorer';

import { shortDate } from '../utils/time/shortDate';
import { shortDateStartOfPeriod } from '../utils/time/shortDateStartOfPeriod';

/**
 * @description Get the unblended monthly spend for a given period.
 * Note that this will stretch/extend the period to cover the start of the
 * month in which the period range extends to. For example, if the period
 * would start on July 15th, the start would be extended to July 1st.
 */
export async function getSpend(
  region: string,
  period: number
): Promise<ResultByTime[]> {
  const costExplorerClient = new CostExplorerClient({ region });

  const start = shortDateStartOfPeriod(period);
  const end = shortDate(0);

  const getCostAndUsageCommand = new GetCostAndUsageCommand({
    TimePeriod: {
      Start: start,
      End: end
    },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost']
  });

  const response = await costExplorerClient.send(getCostAndUsageCommand);
  return response.ResultsByTime || [];
}
