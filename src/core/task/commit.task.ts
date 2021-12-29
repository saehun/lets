import { Task } from './task';
import execa from 'execa';
import * as fs from 'fs-extra';
import { Loading } from '../decorators/Loading';

export class CommitTask implements Task {
  constructor(private readonly message: string) {}

  get name() {
    return `Commit(${this.message})`;
  }

  @Loading(() => `git add . && git commit -m '...'`)
  async execute() {
    const children = await fs.readdir(process.cwd());
    const available = children.includes('.git');
    if (!available) {
      return;
    }

    await execa('git', ['add', '.'], { stdio: 'inherit' });
    await execa('git', ['commit', '-m', this.message], { stdio: 'inherit' }).catch(() => {
      /** noop */
    });
  }

  async onErrorBefore() {
    console.error(`Cannot commit to git`);
  }

  async onErrorAfter() {
    /** noop */
  }
}
