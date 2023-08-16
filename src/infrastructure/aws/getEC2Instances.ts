import {
  EC2Client,
  DescribeInstancesCommand,
  Reservation
} from '@aws-sdk/client-ec2';

/**
 * @description Get all EC2 instances in a region.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/ec2/command/DescribeInstancesCommand/
 */
export async function getEC2Instances(region: string): Promise<Reservation[]> {
  const client = new EC2Client({ region });
  const describeInstancesResponse = await client.send(
    new DescribeInstancesCommand({})
  );

  return describeInstancesResponse.Reservations || [];
}
