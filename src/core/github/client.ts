import got from 'got';

export function createGithubClient(token: string) {
  return got.extend({
    prefixUrl: 'https://api.github.com',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
  });
}
