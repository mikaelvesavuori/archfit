import {
  APIGatewayClient,
  GetMethodCommand
} from '@aws-sdk/client-api-gateway';

import { RequestValidation } from '../../interfaces/RequestValidation';

/**
 * @description Checks for request validation on a given API Gateway.
 */
export async function checkForRequestValidation(
  region: string,
  apiGatewayId: string,
  resourceId: string
): Promise<RequestValidation> {
  const client = new APIGatewayClient({ region });
  const getMethodCommand = new GetMethodCommand({
    restApiId: apiGatewayId,
    resourceId,
    httpMethod: 'ANY'
  });

  const response = await client.send(getMethodCommand);

  return {
    resourceId,
    hasRequestValidation: !!response.requestValidatorId
  };
}
