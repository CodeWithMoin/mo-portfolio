/**
 * Exercise the chat endpoint against a real provider, locally, without deploying.
 *
 *   npx tsx scripts/ask-live.mts "What did he build at Amazon?"
 *
 * Reads NVIDIA_API_KEY / ANTHROPIC_API_KEY and optional ASK_MODEL from .env.local
 * (gitignored). Prints the streamed answer and the response headers; never the key.
 */
import { existsSync, readFileSync } from "node:fs";
import { onRequestPost } from "../functions/api/ask.ts";

const env: Record<string, string> = {};
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"#]*?)"?\s*$/);
    if (match) env[match[1]] = match[2];
  }
}
for (const key of ["NVIDIA_API_KEY", "ANTHROPIC_API_KEY", "ASK_MODEL"]) if (process.env[key]) env[key] = process.env[key]!;

const questions = process.argv.slice(2).length ? process.argv.slice(2) : ["What did he build at Amazon?"];
const store = new Map<string, string>();
const kv = { get: async (k: string) => store.get(k) ?? null, put: async (k: string, v: string) => void store.set(k, v) };
const url = "https://moinuddin.app/api/ask";
const history: { role: "user" | "assistant"; content: string }[] = [];

for (const question of questions) {
  history.push({ role: "user", content: question });
  const started = Date.now();
  const response = await onRequestPost({
    request: new Request(url, {
      method: "POST",
      headers: { origin: "https://moinuddin.app", "content-type": "application/json", "cf-connecting-ip": "127.0.0.1" },
      body: JSON.stringify({ messages: history }),
    }),
    env: { ...env, ASK_LIMITS: kv },
  });
  const headers = Object.fromEntries([...response.headers.entries()].filter(([k]) => k.startsWith("x-ask")));
  process.stdout.write(`\n› ${question}\n  ${response.status} ${JSON.stringify(headers)}\n\n`);
  let text = "";
  let firstToken = 0;
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!firstToken) firstToken = Date.now() - started;
    const chunk = decoder.decode(value, { stream: true });
    text += chunk;
    process.stdout.write(chunk);
  }
  process.stdout.write(`\n\n  (${text.length} chars · first token ${firstToken}ms · total ${Date.now() - started}ms)\n`);
  history.push({ role: "assistant", content: text });
}
