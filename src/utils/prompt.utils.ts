import prompts from 'prompts';
import { AbortException } from '../core/error';

export function onAboart(): never {
  throw new AbortException();
}

export async function ask(message: string, initial = '') {
  const { result } = await prompts(
    {
      type: 'text',
      name: 'result',
      message,
      initial,
    },
    { onCancel: onAboart }
  );
  return result;
}
