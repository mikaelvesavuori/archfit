import { ArchFitData } from './ArchFitData';

export interface DataStore {
  store(key: string, value: any): void;
  hasData(key: string): boolean;
  getData(key?: string): ArchFitData | unknown;
}
