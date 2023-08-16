/**
 * @description Used when an AWS region is not provided.
 */
export class MissingRegionError extends Error {
  constructor() {
    super();
    this.name = 'MissingRegionError';
    this.message = 'Missing region!';
    console.error(this.message);
  }
}
