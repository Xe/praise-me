export interface GenerateRequest {
  model: string;
  prompt: string;
  stream: boolean;
  format?: "json";
  // Unused option
  // deno-lint-ignore no-explicit-any
  options?: any;
  system?: string;
  template?: string;
  context?: number[];
  raw?: boolean;
  keep_alive: string;
}

export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  context: number[];
  done: boolean;
}

export class Client {
  constructor(
    public url: string,
  ) {}

  async generate(inp: GenerateRequest): Promise<GenerateResponse> {
    const u = `${this.url}/api/generate`;

    const resp = await fetch(u, {
      method: "POST",
      body: JSON.stringify(inp),
    });
    if (resp instanceof Error) {
      throw new Error(`error fetching response: ${resp.message}`);
    }

    if (resp.status !== 200) {
      throw new Error(
        `error fetching response: ${resp.status}: ${await resp.text()}`,
      );
    }

    const result = await resp.json() as GenerateResponse;
    if (result instanceof Error) {
      throw new Error(`error parsing GenerateResponse: ${result.message}`);
    }

    return result;
  }
}

const cli = new Client("http://localhost:11434");

export default cli;
