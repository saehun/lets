export function indent(space: number, str: string) {
  return str
    .split('\n')
    .map(line => ' '.repeat(space) + line)
    .join('\n');
}
