import { ArchFitData } from '../../interfaces/ArchFitData';
import { DataStore } from '../../interfaces/DataStore';

/**
 * @description Factory function to vend a new data store instance.
 */
export function createNewFitnessDataStore() {
  return new FitnessDataStore();
}

/**
 * @description Data store implementation for ArchFit data.
 */
class FitnessDataStore implements DataStore {
  private data: ArchFitData = {};

  public store(key: string, value: any) {
    this.data[key as keyof ArchFitData] = value;
  }

  public hasData(key: string) {
    return !!this.data.hasOwnProperty(key);
  }

  public getData(key?: string) {
    if (key) return this.data[key as keyof ArchFitData];
    return this.data;
  }
}
