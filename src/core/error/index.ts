import { indent } from '../../utils/string.utils';

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AbortException extends BaseError {
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends BaseError {
  constructor(name: string, expected: string, given: string) {
    super(`${name} is not found.
expected:
${indent(4, expected)}
given: '${given}'
`);
  }
}

export function handleErrorAndExit(e: any) {
  if (e instanceof BaseError) {
    console.error(e.message);
    process.exit(0);
  }

  console.error(e);
  process.exit(1);
}
