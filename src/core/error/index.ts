import { indent } from '../../utils/string.utils';

export class BaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class AbortException extends BaseError {
  constructor(message?: string) {
    super(message ?? `aborted, bye bye 👋`);
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

export class TaskNotAvailableError extends BaseError {
  constructor(taskName: string, reason: string) {
    super(`Cannot execute '${taskName}':\n    ${reason}`);
  }
}

export class TaskFailureError extends BaseError {
  constructor(e: any) {
    super(e.message);
  }
}

export function handleErrorAndExit(e: any): never {
  if (e instanceof BaseError) {
    console.error(e.message);
    process.exit(0);
  }

  throw e;
}
