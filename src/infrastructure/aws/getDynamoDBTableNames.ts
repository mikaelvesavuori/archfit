import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';

/**
 * @description Lists all DynamoDB tables by name in the given region.
 */
export async function getDynamoDBTableNames(region: string): Promise<string[]> {
  const client = new DynamoDBClient({ region });
  const listTablesResponse = await client.send(new ListTablesCommand({}));

  return listTablesResponse.TableNames || [];
}
