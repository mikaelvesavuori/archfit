#!/usr/bin/env node

import { createNewArchFit } from './domain/services/ArchFit';

import { exists } from './infrastructure/utils/io/exists';
import { readFile } from './infrastructure/utils/io/readFile';

/**
 * @description Runs ArchFit from the command line.
 */
async function main() {
  console.log('Running ArchFit...');

  const configExists = exists('archfit.json');

  const configMessage = configExists
    ? 'Found archfit.json...'
    : 'No archfit.json found!';

  console.log(configMessage);

  const config = configExists ? readFile('archfit.json') : null;

  const archfit = await createNewArchFit(config);
  const results = archfit.runTests();

  console.log(results);
}

main();

export { createNewArchFit } from './domain/services/ArchFit';
export * from './interfaces/ArchFitConfiguration';
export * from './interfaces/FitnessInput';
