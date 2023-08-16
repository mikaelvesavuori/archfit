import { S3Client, ListObjectsCommand } from '@aws-sdk/client-s3';

import { getS3Buckets } from './getS3Buckets';

/**
 * @description Lists all public S3 buckets in the given region.
 */
export async function getPublicS3Buckets(region: string): Promise<string[]> {
  const client = new S3Client({ region });
  const buckets = await getS3Buckets(region);

  const publicBuckets: string[] = [];

  for await (const bucket of buckets) {
    try {
      const listObjectsResponse = await client.send(
        new ListObjectsCommand({
          Bucket: bucket.Name || '',
          MaxKeys: 1
        })
      );

      if (
        !listObjectsResponse.Contents ||
        listObjectsResponse.Contents.length === 0
      ) {
        // The bucket is empty, so it's considered private
        continue;
      }

      publicBuckets.push(bucket.Name || '');
    } catch (error) {
      // Error indicates that we couldn't access the bucket, so consider it private
      continue;
    }
  }

  return publicBuckets;
}
