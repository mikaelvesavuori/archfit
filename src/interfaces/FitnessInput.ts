import { ArchFitTestName } from './ArchFitConfiguration';
import { ArchFitData } from './ArchFitData';

/**
 * @description Input to each fitness function.
 */
export interface FitnessInput {
  name: ArchFitTestName;
  threshold: number;
  period: number;
  region: string;
  data: ArchFitData;
  required?: string[];
}
