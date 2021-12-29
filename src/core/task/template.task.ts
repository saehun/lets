import * as fs from 'fs-extra';
import * as path from 'path';
import rimraf from 'rimraf';
import { find, interpolateFile } from '../../utils/file.utils';
import { Loading } from '../decorators/Loading';
import { Template } from '../template/template';
import { Task } from './task';

export class TemplateTask implements Task {
  private targetPath: string;

  constructor(
    private readonly template: Template,
    private readonly projectName: string,
    private readonly context: Record<string, any>
  ) {
    this.targetPath = path.join(process.cwd(), this.projectName);
  }

  async canExecute() {
    const pathExist = await this.checkIfExist(this.targetPath);
    return {
      available: !pathExist,
      reason: pathExist ? `'${this.projectName}' is already exist` : '',
    };
  }

  get name() {
    return `Template(${this.template.name})`;
  }

  async execute(): Promise<void> {
    await this.copy(this.template.dir, this.targetPath);
    await this.interpolateAll(this.targetPath, this.context);
  }

  async onError(): Promise<void> {
    this.clean(this.targetPath);
  }

  @Loading(() => `copy project files`)
  private async copy(sourcePath: string, targetPath: string) {
    await fs.copy(sourcePath, targetPath, { recursive: true, filter: src => !src.includes('node_modules') });
  }

  @Loading((args: any) => `remove ${args[0]}`)
  private clean(targetPath: string): void {
    rimraf.sync(targetPath);
  }

  @Loading((args: any) => `check if exist ${args[0]}`)
  private async checkIfExist(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath);
  }

  @Loading(() => `interpolate contents`)
  private async interpolateAll(targetPath: string, context: any) {
    const filePaths = await find(targetPath);
    await Promise.all(
      filePaths.map(async filePath => {
        const content = await fs.readFile(filePath, { encoding: 'utf-8' });
        if (/{{.*?}}/.test(content)) {
          await interpolateFile(filePath, context);
        }
      })
    );
  }
}
