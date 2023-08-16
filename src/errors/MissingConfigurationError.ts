/**
 * @description Used to throw an error when the configuration is missing.
 */
export class MissingConfigurationError extends Error {
  constructor() {
    super();
    this.name = 'MissingConfigurationError';
    this.message = 'Missing configuration!';
    console.error(this.message);
  }
}
