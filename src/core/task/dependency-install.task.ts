import execa from 'execa';
import { NotFoundException } from '../error';
import { Task } from './task';
import * as fs from 'fs-extra';

type PackageManagerBin = 'npm' | 'yarn';

export class DependencyInstallTask implements Task {
  constructor(private readonly packageManager: string) {}

  get name() {
    return `DependencyInstall(${this.packageManager})`;
  }

  async execute() {
    assertPackageManager(this.packageManager);
    await this.appendIgnore(this.packageManager);
    await this.install(this.packageManager);

    function assertPackageManager(bin: string): asserts bin is PackageManagerBin {
      if (!['npm', 'yarn'].includes(bin)) {
        throw new NotFoundException('package manager', `'npm' | 'yarn'`, bin);
      }
    }
  }

  private async install(bin: PackageManagerBin) {
    await execa(bin, ['install'], { stdio: 'inherit' });
  }

  private async appendIgnore(bin: PackageManagerBin) {
    await fs.appendFile('.gitignore', bin === 'yarn' ? ignoreForYarn : ignoreForNpm);
  }

  async onError() {
    console.warn(`Failed to install packages...`);
  }
}

const ignoreForYarn = `
# Use yarn
package-lock.json

# Ignore yarn error log
yarn-error.log
`;

const ignoreForNpm = `
# Use npm
yarn.lock
`;
