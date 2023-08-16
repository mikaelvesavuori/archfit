import { writeFileSync } from 'fs';
import { resolve } from 'path';

import { WriteFileError } from '../../../errors/WriteFileError';

/**
 * @description Write a file to disk.
 */
export function writeFile(filePath: string, fileContent: any) {
  if (!filePath || !fileContent) throw new WriteFileError();

  const _filePath = resolve(filePath);
  const _fileContent = JSON.stringify(fileContent, null, ' ');

  writeFileSync(_filePath, _fileContent, 'utf-8');
}
