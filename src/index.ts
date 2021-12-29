import 'reflect-metadata';
require('dotenv').config({ path: require.resolve('../.env') });
import { Builtins, Cli } from 'clipanion';

import { CreateCommand } from './commands/CreateCommand';
import { GithubCommand } from './commands/GithubCommand';

const cli = new Cli({
  binaryLabel: `Auto generating CLI`,
  binaryName: `lets`,
  binaryVersion: `1.0.0`,
});

[CreateCommand, GithubCommand, Builtins.HelpCommand, Builtins.VersionCommand].forEach(command => cli.register(command));

cli.run(process.argv.slice(2));
