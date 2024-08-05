import { FreshContext } from "$fresh/server.ts";
import { Client as OllamaClient } from "@/lib/ollama.ts";
import { Data, Repository } from "@/lib/praise.ts";
import { render } from "https://deno.land/x/gfm@0.6.0/mod.ts";

const kv = await Deno.openKv();
const ollama = new OllamaClient("http://xe-inference.flycast");
const model = "llama3.1:70b";
const githubToken = Deno.env.get("GITHUB_TOKEN");

const prompt = (
  {
    username,
    name,
    bio,
    company,
    location,
    followers,
    following,
    readme,
    repositories
  }: Data,
): string =>
  `Give uplifting words of encouragement for the following github profile. Use two newlines between paragraphs.

Here are the details:

Username: ${username}
Name: ${name}
Bio: ${bio}
Company: ${company}
Location: ${location}
Followers: ${followers}
Following: ${following}

Readme:

${readme}

Projects:

${repositories}`;

const stringifyRepo = ({
  name,
  description,
  stargazers,
  language
}: Repository): string => 
`{
  Project Name: ${name}
  Description: ${description}
  Stars: ${stargazers}
  Language: ${language}
}`;

const getGitHubInfo = async (username: string) => {
  const cached = await kv.get(["github", "profile", username]);
  if (cached.value !== null) {
    return cached.value;
  }

  const resp = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(`Can't fetch data: ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();

  await kv.set(["github", "profile", username], data);

  return data;
};

const getGithubRepos = async (username: string) => {
  const cached = await kv.get(["github", "repos", username]);
  if (cached.value !== null) {
    return cached.value as string;
  }

  const resp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=1`, {
    headers: {
      "Authorization": `Bearer ${githubToken}`,
      "Accept": "application/json",
    },
  });
  if (!resp.ok) {
    throw new Error(`Can't fetch data: ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.json();

  let repositories: Repository[] = data.map((repo: any) => {
      return {
        name: repo.full_name,
        description: repo.description,
        stargazers: repo.stargazers_count,
        language: repo.language
      }
    })

  // sort in descending order by the star count
  repositories.sort((r1, r2) => r2.stargazers - r1.stargazers)
  // take only top 10 projects
  repositories = repositories.slice(0, Math.min(10, repositories.length))
  // create a summary of all public repositories
  const reposSummary = repositories.map(stringifyRepo).join("\n")

  await kv.set(["github", "repos", username], reposSummary);

  return reposSummary;
};

const getGitHubReadme = async (username: string): Promise<string> => {
  const cached = await kv.get<string>(["github", "readme", username]);
  if (cached.value !== null) {
    return cached.value;
  }

  const resp = await fetch(
    `https://raw.githubusercontent.com/${username}/${username}/main/README.md`,
    {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/json",
      },
    },
  );

  if (resp.status == 404) {
    return "This user has no README";
  }

  if (!resp.ok) {
    throw new Error(`Can't fetch data: ${resp.status}: ${await resp.text()}`);
  }
  const data = await resp.text();

  await kv.set(["github", "readme", username], data);

  return data;
};

const getPraise = async (data: Data): Promise<string> => {
  const cached = await kv.get<string>(["github", "praise", data.username]);
  if (cached.value !== null) {
    return cached.value;
  }

  const aiPrompt = prompt(data);

  const resp = await ollama.generate({
    model,
    prompt: aiPrompt,
    stream: false,
    system:
      `You are an expert writer that helps people feel good about themselves and what they are doing in life.`,
    keep_alive: "60m",
    options: {
      "num_ctx": 4096 * 3,
    },
  });

  const praise = render(resp.response);

  await kv.set(["github", "praise", data.username], praise);

  return praise;
};

export const handler = async (
  req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const username = ctx.params.name;

  if (req.method == "DELETE") {
    [
      ["github", "profile", username],
      ["github", "readme", username],
      ["github", "repos", username],
      ["github", "praise", username],
    ].forEach(async (key) => {
      await kv.delete(key);
    });

    console.log({ username, "message": "information deleted" });

    return new Response(
      JSON.stringify({
        message: "Your data has been erased from this service.",
      }),
    );
  }

  try {
    const info = await getGitHubInfo(username);
    const reposSummary = await getGithubRepos(username);
    const readme = await getGitHubReadme(username);

    const data: Data = {
      username,
      avatar_url: info.avatar_url,
      name: info.name,
      bio: info.bio,
      company: info.company,
      location: info.location,
      followers: info.followers,
      following: info.following,
      repositories: reposSummary,
      readme,
    };

    const praise = await getPraise(data);

    return new Response(JSON.stringify({ data, praise }));
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }));
  }
};
