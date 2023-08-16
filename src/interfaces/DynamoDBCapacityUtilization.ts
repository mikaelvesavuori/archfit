/**
 * @description Table name-keyed stats for DynamoDB capacity utilization.
 */
export type DynamoDBCapacityUtilization = {
  [tableName: string]: {
    readCapacityUtilization: number;
    writeCapacityUtilization: number;
  };
};
