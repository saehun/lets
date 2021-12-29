import { Command, Option } from 'clipanion';
import { loadGithubConfig } from '../../core/config/github.config';
import { HandleKnownException } from '../../core/decorators/HandleKnownException';
import { createGithubClient } from '../../core/github/client';
import { CommitTask } from '../../core/task/commit.task';
import { CreateRepositoryTask } from '../../core/task/create-repository.task';
import { GreetingTask } from '../../core/task/greeting.task';
import { PushTask } from '../../core/task/push.task';
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
    const { token, username: owner } = loadGithubConfig();
    const client = createGithubClient(token);
    const pathArray = process.cwd().split('/');
    const repositoryName = pathArray[pathArray.length - 1];

    await new TaskRunner()
      .register(
        new CreateRepositoryTask(client, {
          private: !this.isPublic,
          owner,
          repositoryName,
        })
      )
      .register(new CommitTask('Initialize'))
      .register(new PushTask('origin', 'master'))
      .register(new GreetingTask({ type: 'github', url: `https://github.com/${owner}/${repositoryName}` }))
      .run();

    return 0;
  }
}
