import * as fs from 'fs-extra';
import * as path from 'path';
import prompts from 'prompts';
import { prop } from 'ramda';
import { onAboart } from '../../utils/prompt.utils';
import { NotFoundException } from '../error';
import { Template } from './template';

export class TemplateLoader {
  constructor(private readonly dir = path.join(__dirname, '..', '..', '..', 'resources', 'templates')) {}

  async load(name?: string): Promise<Template> {
    const list = await this.list(this.dir);

    if (name == null) {
      name = await this.select(list.map(item => item.name));
    }

    const selected = list.find(item => item.name === name);

    if (selected == null) {
      throw new NotFoundException('Template', list.map(prop('name')).join('\n'), name);
    }

    return {
      dir: selected.path,
      name: selected.name,
    };
  }

  private async select(candidates: string[]): Promise<string> {
    const { name } = await prompts(
      {
        name: 'name',
        type: 'select',
        message: 'Select a template to start with',
        choices: candidates.map(candidate => ({
          title: candidate,
          value: candidate,
        })),
      },
      { onCancel: onAboart }
    );

    return name;
  }

  private async list(basePath: string) {
    const children = await fs.readdir(basePath, { withFileTypes: true });
    return children
      .filter(child => !child.isFile())
      .map(child => ({
        path: path.join(basePath, child.name),
        name: child.name,
      }));
  }
}
