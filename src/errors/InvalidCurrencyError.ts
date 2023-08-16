/**
 * @description Used when a currency is not supported by the AWS API.
 */
export class InvalidCurrencyError extends Error {
  constructor() {
    super();
    this.name = 'InvalidCurrencyError';
    this.message =
      'Invalid currency! Please use one of the AWS-supported currencies; see https://repost.aws/knowledge-center/supported-aws-currencies.';
    console.error(this.message);
  }
}
