import { ECSClient, ListTasksCommand } from '@aws-sdk/client-ecs';

import { getECSClusters } from './getECSClusters';

/**
 * @description Get all Fargate tasks in all ECS clusters.
 */
export async function getFargateTasks(region: string): Promise<string[]> {
  const client = new ECSClient({ region });
  const clusterArns = await getECSClusters(client);

  const fargateTasks: string[] = [];

  for await (const clusterArn of clusterArns) {
    const tasks = await getTasks(client, clusterArn);
    fargateTasks.push(...tasks);
  }

  return fargateTasks.flat();
}

/**
 * @description Get all Fargate tasks in a single ECS cluster.
 */
async function getTasks(
  client: ECSClient,
  clusterArn: string
): Promise<string[]> {
  const tasks = await client.send(
    new ListTasksCommand({
      cluster: clusterArn,
      launchType: 'FARGATE'
    })
  );

  if (!tasks.taskArns || tasks.taskArns.length === 0) return [];
  return tasks.taskArns;
}
