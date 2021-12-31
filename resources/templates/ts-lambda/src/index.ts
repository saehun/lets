import { Handler } from 'aws-lambda';

const handler: Handler<{ name: string }, { message: string }> = async event => {
  return {
    message: `Hello ${event.name}!`,
  };
};

export { handler };
