import {
  ResourceGroupsTaggingAPIClient,
  GetResourcesCommand,
  ResourceTagMapping
} from '@aws-sdk/client-resource-groups-tagging-api';

/**
 * @description Get a list of resources with their tags.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/resource-groups-tagging-api/command/GetResourcesCommand/
 */
export async function getTaggedResources(
  region: string
): Promise<ResourceTagMapping[]> {
  const client = new ResourceGroupsTaggingAPIClient({ region });
  const response = await client.send(
    new GetResourcesCommand({ ResourceTypeFilters: [] })
  );

  return response.ResourceTagMappingList || [];
}
