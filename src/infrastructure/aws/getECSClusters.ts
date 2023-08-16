import { ECSClient, ListClustersCommand } from '@aws-sdk/client-ecs';

/**
 * @description Lists all ECS clusters.
 */
export async function getECSClusters(client: ECSClient): Promise<string[]> {
  const clusters = await client.send(new ListClustersCommand({}));

  if (!clusters.clusterArns || clusters.clusterArns.length === 0) return [];
  return clusters.clusterArns;
}
