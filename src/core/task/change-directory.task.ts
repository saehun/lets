import { Task } from './task';
import * as path from 'path';

export class ChangeDirectoryTask implements Task {
  private basedir: string;

  constructor(private readonly target: string) {
    this.basedir = process.cwd();
  }

  get name() {
    return `ChangeDirectory(${this.target})`;
  }

  async execute(): Promise<void> {
    process.chdir(path.join(this.basedir, this.target));
  }

  async onErrorBefore(): Promise<void> {
    /** noop */
  }

  async onErrorAfter(): Promise<void> {
    process.chdir(this.basedir);
  }
}
