import { S3Client, ListBucketsCommand, Bucket } from '@aws-sdk/client-s3';

/**
 * @description Lists all S3 buckets in the given region.
 */
export async function getS3Buckets(region: string): Promise<Bucket[]> {
  const client = new S3Client({ region });
  const listBucketsResponse = await client.send(new ListBucketsCommand({}));

  return listBucketsResponse.Buckets || [];
}
