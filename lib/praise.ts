export interface Data {
  username: string;
  avatar_url: string;
  name: string;
  bio: string;
  company: string;
  location: string;
  followers: number;
  following: number;
  readme: string;
  repositories: string;
}

export interface Repository {
  name: string,
  description: string,
  stargazers: number,
  language: string
}