import { FitnessInput } from '../../src/interfaces/FitnessInput';

const baseInput = (name: string) => {
  return {
    name,
    threshold: 0,
    period: 30,
    region: 'eu-north-1',
    data: {}
  } as FitnessInput;
};

/**
 *
 */
export function createInput(
  name: string,
  newData: Record<string, any> = {}
): FitnessInput {
  return Object.assign(baseInput(name), newData);
}
