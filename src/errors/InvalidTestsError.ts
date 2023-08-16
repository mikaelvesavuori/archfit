/**
 * @description Used to throw an error when the tests are missing.
 */
export class InvalidTestsError extends Error {
  constructor() {
    super();
    this.name = 'InvalidTestsError';
    this.message = 'Missing or invalid tests!';
    console.error(this.message);
  }
}
