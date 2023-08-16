/**
 * @description Used to throw an error when the "writeReport" option is not a boolean.
 */
export class InvalidWriteReportOptionError extends Error {
  constructor() {
    super();
    this.name = 'InvalidWriteReportOptionError';
    this.message = 'The "writeReport" option must be a boolean!';
    console.error(this.message);
  }
}
