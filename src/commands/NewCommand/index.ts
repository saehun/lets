import { Command, Option } from 'clipanion';
import { loadGithubConfig } from '../../core/config/github.config';
import { HandleKnownException } from '../../core/decorators/HandleKnownException';
import { TaskRunner } from '../../core/task/task.runner';
import { TemplateTask } from '../../core/task/template.task';
import { TemplateLoader } from '../../core/template/template.loader';
import { ask } from '../../utils/prompt.utils';

export class NewCommand extends Command {
  static paths = [['new']];
  static usage = Command.Usage({
    category: 'scaffold',
    description: 'Scaffold new project',
    details: `If you omit 'name' or 'template' arguments, it will turn into interactive prompt and ask you some questions`,
  });

  template = Option.String({ required: false });
  name = Option.String({ required: false });
  packageManager = Option.String('--package-manager', 'npm', { description: '`npm` or `yarn`. default `npm`' });
  git = Option.Boolean('--git', true, { description: 'Initialize git, default `true`' });

  @HandleKnownException()
  async execute() {
    const taskRunner = new TaskRunner();
    const template = await new TemplateLoader().load(this.template);
    const projectName = this.name ?? (await ask('project name?'));

    const context = {
      github: loadGithubConfig(),
      project: { name: projectName },
    };

    await taskRunner
      .register(new TemplateTask(template, projectName, context))
      .register(new ChangeDirectoryTask(projectName))
      .register(new DependencyTask(this.packageManager))
      .register(new GitInitializeTask(this.git))
      .register(new GreetingTask(projectName))
      .run();

    return 0;
  }
}
