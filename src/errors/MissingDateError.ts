/**
 * @description Used when ArchFit data (from the DataService) is missing.
 */
export class MissingDataError extends Error {
  constructor() {
    super();
    this.name = 'MissingDataError';
    this.message = 'Missing ArchFit data!';
    console.error(this.message);
  }
}
