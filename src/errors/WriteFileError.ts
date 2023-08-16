/**
 * @description Used to throw error when the file path or file contents are missing.
 */
export class WriteFileError extends Error {
  constructor() {
    super();
    this.name = 'WriteFileError';
    this.message = 'Missing file path or contents!';
    console.error(this.message);
  }
}
