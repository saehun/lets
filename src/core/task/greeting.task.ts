import { Task } from './task';
import boxen from 'boxen';
import chalk from 'chalk';
import clipboardy from 'clipboardy';

export class GreetingTask implements Task {
  constructor(private readonly projectName: string) {}

  get name() {
    return 'Greeting';
  }

  async execute() {
    await clipboardy.write(`cd ${this.projectName}`);
    console.log(
      boxen([`${chalk.greenBright(this.projectName)} is generated ✨`, `cd ${this.projectName} (copied)`].join('\n'), {
        padding: 2,
      })
    );
  }

  async onError() {
    /** noop */
  }
}
