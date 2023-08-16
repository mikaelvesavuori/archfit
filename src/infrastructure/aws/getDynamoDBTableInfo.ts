import {
  DynamoDBClient,
  DescribeTableCommand,
  TableDescription
} from '@aws-sdk/client-dynamodb';

/**
 * @description Get information about all provided DynamoDB tables.
 */
export async function getDynamoDBTableInfo(
  region: string,
  tables: string[]
): Promise<TableDescription[]> {
  const client = new DynamoDBClient({ region });

  const tableInfo = [];

  for await (const table of tables) {
    const describeTableCommand = new DescribeTableCommand({
      TableName: table
    });
    const describeTableResponse = await client.send(describeTableCommand);

    if (describeTableResponse.Table)
      tableInfo.push(describeTableResponse.Table);
  }

  return tableInfo;
}
