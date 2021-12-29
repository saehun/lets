import * as fs from 'fs-extra';
import * as path from 'path';
import prompts from 'prompts';
import { prop } from 'ramda';
import { onAboart } from '../../utils/prompt.utils';
import { NotFoundException } from '../error';
import { Template } from './template';

export class TemplateLoader {
  private constructor(private readonly dir = path.join(__dirname, '..', '..', '..', 'resources', 'templates')) {}

  async load(name?: string): Promise<Template> {
    const list = await this.list();

    if (name == null) {
      name = await this.select(list.map(item => item.name));
    }

    const selected = list.find(item => item.name === name);

    if (selected == null) {
      throw new NotFoundException('Template', list.map(prop('name')).join('\n'), name);
    }

    return new Template(selected.name, selected.path);
  }

  private async select(candidates: string[]): Promise<string> {
    const { name } = await prompts(
      {
        name: 'name',
        type: 'select',
        choices: candidates.map(candidate => ({
          title: candidate,
          value: candidate,
        })),
      },
      { onCancel: onAboart }
    );

    return name;
  }

  private async list() {
    const children = await fs.readdir(this.dir, { withFileTypes: true });
    return children
      .filter(child => !child.isFile)
      .map(child => ({
        path: path.join(this.dir, child.name),
        name: child.name,
      }));
  }
}
