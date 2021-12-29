import * as fs from 'fs-extra';
import { compile } from 'handlebars';
import * as path from 'path';

export async function interpolateFile(path: string, arg: Record<string, any>): Promise<void> {
  const file = await fs.readFile(path, { encoding: 'utf-8' });
  const template = compile(file);
  await fs.writeFile(path, template(arg), { encoding: 'utf-8' });
}

/**
 * same as unix command 'find'
 */
export const find = async (startPath: string, ignore: string | RegExp = ''): Promise<string[]> => {
  const regex = typeof ignore === 'string' ? new RegExp(ignore) : ignore;
  const result: string[] = [];
  await recur(startPath);

  async function recur(curPath: string): Promise<void> {
    const children = await fs.readdir(curPath, { withFileTypes: true });
    await Promise.all(
      children
        .filter(f => {
          if (ignore && regex.test(f.name)) {
            return false;
          } else if (/\.git/.test(f.name) || /node_modules/.test(f.name)) {
            return false;
          } else if (f.isFile()) {
            result.push(path.join(curPath, f.name));
            return false;
          } else {
            return true;
          }
        })
        .map(async f => {
          await recur(path.join(curPath, f.name));
        })
    );
  }
  return result;
};
