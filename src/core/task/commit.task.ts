import { Task } from './task';
import execa from 'execa';
import * as fs from 'fs-extra';

export class CommitTask implements Task {
  constructor(private readonly message: string) {}

  async canExecute() {
    const children = await fs.readdir(process.cwd());
    const available = children.includes('.git');
    return {
      available,
      reason: available ? '' : `Not a git repository`,
    };
  }

  get name() {
    return `Commit(${this.message})`;
  }

  async execute() {
    await execa('git', ['add', '.']);
    await execa('git', ['commit', '-m', this.message]);
  }

  async onErrorBefore() {
    console.error(`Cannot commit and push to git`);
  }

  async onErrorAfter() {
    await execa('git', ['reset', '--hard']);
  }
}
