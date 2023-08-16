import {
  LambdaClient,
  ListFunctionsCommand,
  FunctionConfiguration
} from '@aws-sdk/client-lambda';

/**
 * @description Lists all Lambda functions in the given region.
 * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-lambda/Interface/GetFunctionConfigurationCommandOutput/
 */
export async function getLambdaFunctions(
  region: string
): Promise<FunctionConfiguration[]> {
  const client = new LambdaClient({ region });
  const listFunctionsResponse = await client.send(new ListFunctionsCommand({}));

  return listFunctionsResponse.Functions || [];
}
