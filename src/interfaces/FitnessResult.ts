/**
 * @description The result of fitness function.
 */
export interface FitnessResult {
  name: string;
  success: boolean;
  threshold: number;
  actual: string | Record<string, any> | number;
}
