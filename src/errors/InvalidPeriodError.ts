/**
 * @description Used when the period is not a number.
 */
export class InvalidPeriodError extends Error {
  constructor() {
    super();
    this.name = 'InvalidPeriodError';
    this.message = 'Period must be a number!';
    console.error(this.message);
  }
}
