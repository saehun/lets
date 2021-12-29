import 'reflect-metadata';
require('dotenv').config();
import { Builtins, Cli } from 'clipanion';

import { NewCommand } from './commands/NewCommand';

const cli = new Cli({
  binaryLabel: `Create cli`,
  binaryName: `create`,
  binaryVersion: `1.0.0`,
});

[NewCommand, Builtins.HelpCommand, Builtins.VersionCommand].forEach(command => cli.register(command));

cli.runExit(process.argv.slice(2)).catch(e => {
  handleErrorAndExit(e);
});
