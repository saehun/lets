import * as fs from 'fs-extra';
import { sortPackageJson } from 'sort-package-json';
import { loadPackageJson } from '../../utils/file.utils';
import { Loading } from '../decorators/Loading';
import { Task } from './task';
import * as path from 'path';

export class PackageBinaryTask implements Task {
  constructor(private readonly command: string, private readonly bin: string) {}

  get name() {
    return `PackageBinary(${this.bin})`;
  }

  @Loading(() => `sort packagej.json field`)
  async execute() {
    const packageJson = loadPackageJson();
    fs.writeJSONSync('package.json', this.updatePackageJson(packageJson), { spaces: 2 });
    await this.createScript();
  }

  @Loading(() => `update package.json`)
  private updatePackageJson(packageJson: Record<string, any>) {
    packageJson.bin = {
      [this.command]: this.bin,
    };
    const buildScript = packageJson.scripts?.build;
    if (typeof buildScript === 'string') {
      packageJson.scripts.build = buildScript + ' && .scripts/postbuild.sh';
    }
    return sortPackageJson(packageJson);
  }

  @Loading(() => `create .scripts/postbuild.sh`)
  private async createScript() {
    const dirpath = path.join(process.cwd(), '.scripts');
    const filepath = path.join(dirpath, 'postbuild.sh');
    await fs.ensureDir(dirpath);
    await fs.writeFile(filepath, this.postbuildScript());
    await fs.chmod(filepath, '755'); // rwxr-xr-x
  }

  private postbuildScript() {
    return `
#!/bin/bash

echo "$(echo '#!/usr/bin/env node' | cat - ${this.bin})" > ${this.bin}
chmod +x ${this.bin}
`.trimStart();
  }

  async onErrorBefore() {
    console.warn(`Failed to packageJson packages...`);
  }

  async onErrorAfter() {
    /** noop */
  }
}
