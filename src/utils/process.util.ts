import { existsSync } from 'fs-extra';
import { homedir } from 'os';
import * as path from 'path';
import { UserError } from '../core/error';

export function ensureProcessWorkingDirectoryHas(target: string, currentDirectory = process.cwd()) {
  for (const tsconfigPath of generateParentPathOf(path.join(currentDirectory, target))) {
    if (existsSync(tsconfigPath)) {
      process.chdir(path.parse(tsconfigPath).dir);
      return;
    }
  }
  throw new UserError(`Failed to find ${target}`);
}

function parentOf(basePath: string) {
  const { dir, base } = path.parse(basePath);
  return path.join(dir, '..', base);
}

function* generateParentPathOf(basePath: string, until = homedir()): IterableIterator<string> {
  do {
    yield basePath;
    basePath = parentOf(basePath);
  } while (basePath !== until);
}
