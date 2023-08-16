import { ArchFitTest } from './ArchFitConfiguration';
import { ArchFitData } from './ArchFitData';

export interface DataService {
  getData(region: string, tests: ArchFitTest[]): Promise<ArchFitData>;
}
