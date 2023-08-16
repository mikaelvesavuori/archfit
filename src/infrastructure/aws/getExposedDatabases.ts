import { getRDSDatabases } from './getRDSDatabases';

/**
 * @description Lists all the RDS Databases that are publicly accessible.
 */
export async function getExposedDatabases(region: string): Promise<string[]> {
  const instances = await getRDSDatabases(region);

  const exposedDatabases: string[] = [];

  for (const dbInstance of instances) {
    if (dbInstance.PubliclyAccessible === true)
      exposedDatabases.push(dbInstance.DBInstanceIdentifier || '');
  }

  return exposedDatabases;
}
