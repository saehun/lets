import { Task } from './task';
import execa from 'execa';
import { Got, RequestError } from 'got';
import { Loading } from '../decorators/Loading';

export class CreateRepositoryTask implements Task {
  private readonly uri: string;

  constructor(
    private readonly client: Got,
    private readonly option: { private: boolean; owner: string; repositoryName: string }
  ) {
    this.uri = `${this.option.owner}/${this.option.repositoryName}`;
  }

  async canExecute() {
    try {
      await this.client.get(`repos/${this.uri}`);
      return {
        available: false,
        reason: `https://github.com/${this.uri} already exist`,
      };
    } catch (e: unknown) {
      if (e instanceof RequestError && e.response?.statusCode === 404) {
        return {
          available: true,
          reason: '',
        };
      } else {
        throw e;
      }
    }
  }

  get name() {
    return `CreateRepository(${this.uri})`;
  }

  async execute() {
    const gitUrl = await this.createRepository(this.option.repositoryName, this.option.private);
    await this.setRemoteOrigin(gitUrl);
  }

  @Loading(args => `Create new repository '${args[0]}'(${args[1] ? 'private' : 'public'})`)
  private async createRepository(name: string, isPrivate: boolean): Promise<string> {
    const { ssh_url } = await this.client
      .post('user/repos', {
        json: {
          name,
          private: isPrivate,
        },
      })
      .json<{ html_url: string; ssh_url: string }>();

    return ssh_url;
  }

  @Loading(() => `set remote url...`)
  private async setRemoteOrigin(gitUrl: string) {
    await execa('git', ['remote', 'add', 'origin', gitUrl]);
  }

  async onErrorBefore() {
    console.error(`Cannot create repository ${this.uri}`);
  }

  async onErrorAfter() {
    console.error(`Please manually delete repository https://github.com/${this.uri}/settings#danger-zone`);
  }
}
