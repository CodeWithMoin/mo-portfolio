import assert from "node:assert/strict";
import { onRequest as ask } from "../functions/api/ask";
import { onRequest as contact } from "../functions/api/contact";

type KV = { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> };

const kv = (): KV => {
  const values = new Map<string, string>();
  return {
    get: async (key) => values.get(key) ?? null,
    put: async (key, value) => void values.set(key, value),
  };
};

const request = (path: string, body: unknown, init: RequestInit = {}) =>
  new Request(`https://moinuddin.app${path}`, {
    method: "POST",
    headers: { origin: "https://moinuddin.app", "content-type": "application/json", "cf-connecting-ip": "203.0.113.10", ...init.headers },
    body: JSON.stringify(body),
    ...init,
  });

const originalFetch = globalThis.fetch;

try {
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("generativelanguage.googleapis.com")) return new Response('data: {"choices":[{"delta":{"content":"Safe answer."}}]}\n\ndata: [DONE]\n\n', { status: 200 });
    if (url.includes("api.resend.com")) return new Response("{}", { status: 200 });
    throw new Error(`unexpected fetch: ${url}`);
  };

  const askEnv = { GEMINI_API_KEY: "test-only", ASK_LIMITS: kv(), ASK_DAILY_LIMIT: "2", ASK_GLOBAL_DAILY_LIMIT: "20", ASK_MINUTE_LIMIT: "20" };
  let response = await ask({ request: new Request("https://moinuddin.app/api/ask"), env: askEnv });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");

  response = await ask({ request: request("/api/ask", { messages: [{ role: "user", content: "What did Moin build?" }] }, { headers: { origin: "https://attacker.example" } }), env: askEnv });
  assert.equal(response.status, 403);

  response = await ask({ request: request("/api/ask", { messages: [{ role: "user", content: "x".repeat(601) }] }), env: askEnv });
  assert.equal(response.status, 400);

  response = await ask({ request: request("/api/ask", { messages: [{ role: "user", content: "What did Moin build?" }] }), env: askEnv });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "Safe answer.");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-ask-model"), null);

  response = await ask({ request: request("/api/ask", { messages: [{ role: "user", content: "And what else?" }] }), env: askEnv });
  assert.equal(response.status, 200);
  await response.text();
  response = await ask({ request: request("/api/ask", { messages: [{ role: "user", content: "One more" }] }), env: askEnv });
  assert.equal(response.status, 429);

  const contactEnv = { RESEND_API_KEY: "test-only", ASK_LIMITS: kv() };
  response = await contact({ request: request("/api/contact", { name: "M", email: "bad", message: "This is a valid message.", elapsed: 3000 }), env: contactEnv });
  assert.equal(response.status, 400);

  response = await contact({ request: request("/api/contact", { name: "Visitor", email: "visitor@example.com", message: "This is a valid message.", elapsed: 3000 }), env: contactEnv });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-security-policy"), "default-src 'none'; frame-ancestors 'none'");

  console.log("security checks passed");
} finally {
  globalThis.fetch = originalFetch;
}
