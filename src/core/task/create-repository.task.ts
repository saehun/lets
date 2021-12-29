import { Task } from './task';
import { Got, RequestError, Response } from 'got';

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
      await this.client.get(`/repos/${this.uri}`);
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
    await this.client
      .post('/user/repos', {
        json: {
          name: this.option.repositoryName,
          private: this.option.private,
        },
      })
      .json<Response<{ html_url: string }>>();
  }

  async onErrorBefore() {
    console.error(`Cannot create repository ${this.uri}`);
  }

  async onErrorAfter() {
    console.error(`Please manually delete repository https://github.com/${this.uri}/settings#danger-zone`);
  }
}
