import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @description Read a file and return its content.
 */
export function readFile(filePath: string) {
  const isJson = filePath.endsWith('.json');
  const file = readFileSync(resolve(filePath), 'utf-8');

  return isJson ? JSON.parse(file) : file;
}
