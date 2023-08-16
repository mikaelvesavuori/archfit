import {
  APIGatewayClient,
  GetRequestValidatorsCommand,
  RequestValidator,
  RestApi
} from '@aws-sdk/client-api-gateway';

/**
 * @description Retrieves all request validators for all provided API Gateway instances.
 */
export async function getAPIGatewayRequestValidators(
  region: string,
  instances: RestApi[]
): Promise<RequestValidator[]> {
  const client = new APIGatewayClient({ region });

  const validators: RequestValidator[] = [];

  for await (const instance of instances) {
    const getResourcesCommand = new GetRequestValidatorsCommand({
      restApiId: instance.id
    });

    const response = await client.send(getResourcesCommand);

    if (response.items) validators.push(...response.items);
  }

  return validators;
}
