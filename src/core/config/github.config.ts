export interface GithubConfig {
  email: string;
  token: string;
  username: string;
  authorname: string;
}

export function loadGithubConfig() {
  const config: GithubConfig = {
    email: process.env.GITHUB_EMAIL!,
    token: process.env.GITHUB_TOKEN!,
    username: process.env.GITHUB_USERNAME!,
    authorname: process.env.GITHUB_AUTHORNAME!,
  };

  return config;
}
