import {
  RDSClient,
  DescribeDBInstancesCommand,
  DBInstance
} from '@aws-sdk/client-rds';

/**
 * @description Lists all RDS databases in a region.
 */
export async function getRDSDatabases(region: string): Promise<DBInstance[]> {
  const client = new RDSClient({ region });
  const describeDBInstancesResponse = await client.send(
    new DescribeDBInstancesCommand({})
  );

  return describeDBInstancesResponse.DBInstances || [];
}
