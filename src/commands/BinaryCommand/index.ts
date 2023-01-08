import { Command } from 'clipanion';
import { HandleKnownException } from '../../core/decorators/HandleKnownException';
import { UserError } from '../../core/error';
import { PackageBinaryTask } from '../../core/task/package-binary.task';
import { TaskRunner } from '../../core/task/task.runner';
import { loadPackageJson } from '../../utils/file.utils';
import { ask } from '../../utils/prompt.utils';

export class BinaryCommand extends Command {
  static paths = [['binary']];
  static usage = Command.Usage({
    category: 'alternate',
    description: 'make project binary',
    details: `If you omit 'name' or 'template' arguments, it will turn into interactive prompt and ask you some questions`,
    examples: [['Make project binary', 'lets binary']],
  });

  @HandleKnownException()
  async execute() {
    const taskRunner = new TaskRunner();
    if (loadPackageJson().bin) {
      throw new UserError('Package has already binary');
    }

    const command = await ask('command?');
    const bin = await ask('exetute target?', 'dist/index.js');

    await taskRunner.register(new PackageBinaryTask(command, bin)).run();

    return 0;
  }
}
