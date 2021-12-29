import { Command, Option } from 'clipanion';
import { HandleKnownException } from '../../core/decorators/HandleKnownException';
import { TaskRunner } from '../../core/task/task.runner';

export class GithubCommand extends Command {
  static paths = [['github']];
  static usage = Command.Usage({
    category: 'alternate',
    description: 'Upload current git repository to github',
    details: 'Upload current git repository to github',
    examples: [['Create remote repository and push', 'lets github']],
  });

  push = Option.Boolean('--push', true, { description: 'push to repository' });
  commit = Option.Boolean('--commit', true, { description: 'create an `Initialize` commit' });
  isPublic = Option.Boolean('--public', false, { description: 'make repository public' });

  @HandleKnownException()
  async execute() {
    await new TaskRunner()
      .register(new CreateRepositoryTask(isPublic))
      .register(new CommitTask('Initialize'))
      .register(new PushTask())
      .run();

    return 0;
  }
}
