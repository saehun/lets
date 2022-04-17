import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

// Commmand: terraform state show aws_lambda_function.function
// to retrieve lambda metadata
describe('invoke lambda', () => {
  it('successfully invoke lambda', async () => {
    const client = new LambdaClient({ region: 'ap-northeast-2' });
    const response = await client.send(
      new InvokeCommand({
        FunctionName: '',
        Payload: jsonToPayload({ name: '' }),
      })
    );
    console.log(parseResponse(response.Payload));
  });
});

function parseResponse(payload?: Uint8Array): Record<string, any> {
  if (payload == null) {
    return {};
  }
  return JSON.parse(Buffer.from(payload).toString('utf-8'));
}

function jsonToPayload(data: Record<string, any>): Uint8Array {
  return Buffer.from(JSON.stringify(data));
}
