import fs from 'fs';
import path from 'path';

/**
 * @description Checks if the provided path is an actual file or directory.
 */
export function exists(basePath: string, additionalPath = ''): boolean {
  return fs.existsSync(path.join(basePath, additionalPath));
}
