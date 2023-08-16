import {
  APIGatewayClient,
  GetRestApisCommand,
  RestApi
} from '@aws-sdk/client-api-gateway';

/**
 * @description Lists all the API Gateway (REST) APIs in the given region.
 */
export async function getAPIGatewayRESTInstances(
  region: string
): Promise<RestApi[]> {
  const client = new APIGatewayClient({ region });
  const getRestApisCommand = new GetRestApisCommand({});
  const response = await client.send(getRestApisCommand);

  return response.items || [];
}
