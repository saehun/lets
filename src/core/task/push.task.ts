import { Task } from './task';
import execa from 'execa';
import * as fs from 'fs-extra';

export class PushTask implements Task {
  constructor(private readonly remote: string, private readonly branch: string) {}

  async canExecute() {
    const children = await fs.readdir(process.cwd());
    const available = children.includes('.git');
    return {
      available,
      reason: available ? '' : `Not a git repository`,
    };
  }

  get name() {
    return `Push(${this.remote}/${this.branch})`;
  }

  async execute() {
    await execa('git', ['push', this.remote, this.branch]);
  }

  async onErrorBefore() {
    console.error(`Cannot push to ${this.remote}/${this.branch}`);
  }

  async onErrorAfter() {
    console.error(`Please manually revert pushed revision (e.g. reset and force push)`);
  }
}
