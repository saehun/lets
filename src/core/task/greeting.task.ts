import { Task } from './task';
import boxen from 'boxen';
import chalk from 'chalk';
import clipboardy from 'clipboardy';

type GreetCreateOption = {
  type: 'create';
  projectName: string;
};

type GreetGithubOption = {
  type: 'github';
  url: string;
};

export type GreetingOptions = GreetCreateOption | GreetGithubOption;

export class GreetingTask implements Task {
  constructor(private readonly option: GreetingOptions) {}

  get name() {
    return 'Greeting';
  }

  async execute() {
    if (this.option.type === 'create') {
      return await this.greetCreate(this.option);
    } else {
      return await this.greetGithub(this.option);
    }
  }

  private async greetCreate({ projectName }: GreetCreateOption) {
    await clipboardy.write(`cd ${projectName}`);
    this.greet(
      `${chalk.greenBright(projectName)} is generated ✨`,
      `cd ${projectName} (copied)`,
      chalk.grey(`tip: 'lets github' to create a remote repository`)
    );
  }

  private async greetGithub({ url }: GreetGithubOption) {
    this.greet(`New repository created ✨`, url);
  }

  private greet(...messages: string[]): void {
    console.log(boxen(messages.join('\n')), { padding: 2 });
  }

  async onErrorBefore() {
    /** noop */
  }

  async onErrorAfter() {
    /** noop */
  }
}
