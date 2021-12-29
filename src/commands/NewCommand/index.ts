import { Command, Option } from 'clipanion';

export class NewCommand extends Command {
  static paths = [['new']];
  static usage = Command.Usage({
    category: 'scaffold',
    description: 'Scaffold new project',
    details: `If you omit 'name' or 'template' arguments, it will turn into interactive prompt and ask you some questions`,
  });

  template = Option.String({ required: false });
  name = Option.String({ required: false });
  help = true;

  async execute() {
    this.context.stdout.write(`Hello ${this.template} ${this.name}!\n`);
    return 0;
  }
}
