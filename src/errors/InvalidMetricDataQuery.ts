/**
 * @description Thrown when an invalid query is used to create a MetricDataCommand.
 */
export class InvalidMetricDataQuery extends Error {
  constructor(message: string) {
    super();
    this.name = 'InvalidMetricDataQuery';
    this.message = `Invalid query: ${message}`;
    console.error(this.message);
  }
}
