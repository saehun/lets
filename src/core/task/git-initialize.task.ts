import execa from 'execa';
import { Task } from './task';

export class GitInitializeTask implements Task {
  constructor(private readonly proceed: boolean) {}

  get name() {
    return 'GitInitialize';
  }

  async execute() {
    if (this.proceed) {
      await execa('git', ['init']);
    }
  }

  async onErrorBefore() {
    console.warn(`Failed to initialize git...`);
  }

  async onErrorAfter() {
    /** noop */
  }
}
