#!/usr/bin/env node

import { createNewArchFit } from './domain/services/ArchFit';

import { exists } from './infrastructure/utils/io/exists';
import { readFile } from './infrastructure/utils/io/readFile';

/**
 * @description Runs ArchFit from the command line. If it can be inferred
 * that we are not in a CLI environment, then it does nothing.
 */
async function main() {
  const isRunFromCommandLine =
    process.argv[1] && process.argv[1].includes('node_modules/.bin/archfit');
  if (!isRunFromCommandLine) return;

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
