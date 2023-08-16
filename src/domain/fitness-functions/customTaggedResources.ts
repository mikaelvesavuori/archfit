import { ResourceTagMapping } from '@aws-sdk/client-resource-groups-tagging-api';

import { FitnessInput } from '../../interfaces/FitnessInput';
import { FitnessResult } from '../../interfaces/FitnessResult';

import { moreOrEqual } from '../../infrastructure/utils/math/moreOrEqual';
import { value } from '../../infrastructure/utils/string/value';
import { toPercent } from '../../infrastructure/utils/string/toPercent';

/**
 * @description Checks if the number of resources with the given tags is greater than or equal to the given threshold.
 *
 * This is calculated as a percentage of all tagged resources.
 *
 * Note that tags are case-sensitive.
 */
export function customTaggedResourcesFitnessFunction(
  input: FitnessInput
): FitnessResult {
  const { name, threshold, required } = input;

  const { taggedResources } = input.data;
  const taggedResourcePercentage = calculateCustomTaggedResourcePercentage(
    taggedResources || [],
    required || []
  );

  const success = moreOrEqual(taggedResourcePercentage, threshold);
  const actual = value(taggedResourcePercentage, '%');

  return {
    name,
    success,
    threshold,
    actual
  };
}

/**
 * @param resources
 * @param requiredTags
 * @example
 */
function calculateCustomTaggedResourcePercentage(
  resources: ResourceTagMapping[],
  requiredTags: string[]
): number {
  if (resources.length === 0) return 0;

  const { taggedResources } = resourceLists(resources);
  const result = validatedTags(taggedResources, requiredTags);
  const correctlyTaggedResources = result.filter((item) => item.success).length;

  return toPercent(correctlyTaggedResources, resources.length);
}

/**
 * @param resources
 * @example
 */
function resourceLists(resources: ResourceTagMapping[]) {
  const taggedResources: Record<string, string[]> = {};
  const untaggedResources: string[] = [];

  resources.forEach((resource: ResourceTagMapping) => {
    const arn = resource.ResourceARN as string;
    if (resource.Tags && resource.Tags.length > 0)
      taggedResources[arn] = resource.Tags?.map(
        (tag: Record<string, any>) => tag.Key
      );
    else untaggedResources.push(arn);
  });

  return {
    totalResourceCount: resources.length,
    taggedResources,
    untaggedResources
  };
}

/**
 * @param tags
 * @param requiredKeys
 * @example
 */
function includesAllRequiredKeys(
  tags: string[],
  requiredKeys: string[]
): boolean {
  return requiredKeys.every((key) => tags.some((tag) => tag === key));
}

/**
 * @param taggedResources
 * @param requiredTags
 * @example
 */
function validatedTags(
  taggedResources: Record<string, any>,
  requiredTags: string[]
) {
  return Object.entries(taggedResources).map((item: Record<string, any>) => {
    // @ts-ignore
    const [resource, values] = item;
    const success = includesAllRequiredKeys(values, requiredTags);
    return {
      resource,
      success,
      values
    };
  });
}
