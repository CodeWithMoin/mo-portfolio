/**
 * POST /api/contact — the contact form (Cloudflare Pages Function), sent via Resend.
 *
 * Same shape as the chat endpoint: the key never reaches the browser, and without
 * RESEND_API_KEY it answers 503 so the form can point people at the email address.
 *
 * Guardrails: same-origin + JSON only, a size cap, field validation, a honeypot
 * field bots fill and people never see, a minimum time-on-page, and a per-IP daily
 * limit that shares the chat's KV namespace. The visitor's address goes in
 * reply_to, so replying from the inbox answers them directly.
 */

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  RESEND_API_KEY?: string;
  /** Where messages are delivered. Defaults to hello@moinuddin.app. */
  CONTACT_TO?: string;
  /**
   * Sender. Must be on a domain verified in Resend. Until moinuddin.app is verified,
   * Resend's onboarding@resend.dev works — but only delivers to the Resend
   * account's own address, so set CONTACT_TO to that.
   */
  CONTACT_FROM?: string;
  /** Shared with the chat; per-IP counters. */
  ASK_LIMITS?: KV;
}

const MAX_BODY_BYTES = 8_000;
const PER_IP_PER_DAY = 3;
const MIN_FILL_MS = 2_500;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const json = (status: number, body: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function ipKey(ip: string, day: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`contact:${day}:${ip}`));
  return [...new Uint8Array(digest).slice(0, 12)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

const memory = new Map<string, number>();

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  if (!env.RESEND_API_KEY) return json(503, { error: "not_configured" });

  const origin = request.headers.get("origin");
  let sameOrigin = false;
  try {
    sameOrigin = !!origin && new URL(origin).host === new URL(request.url).host;
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) return json(403, { error: "forbidden" });
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json(415, { error: "unsupported_media_type" });

  let payload: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(413, { error: "too_large" });
    payload = JSON.parse(raw);
  } catch {
    return json(400, { error: "invalid_request" });
  }

  const field = (name: string) => (typeof payload[name] === "string" ? (payload[name] as string).trim() : "");
  const name = field("name");
  const email = field("email");
  const message = field("message");
  const company = field("company"); // honeypot: hidden from people, filled by bots
  const elapsed = typeof payload.elapsed === "number" ? payload.elapsed : 0;

  // A bot gets the same success a person does, so it learns nothing to adapt to.
  if (company || elapsed < MIN_FILL_MS) return json(200, { ok: "sent" });

  if (name.length < 1 || name.length > 100) return json(400, { error: "invalid_name" });
  if (!EMAIL.test(email) || email.length > 200) return json(400, { error: "invalid_email" });
  if (message.length < 10 || message.length > 4000) return json(400, { error: "invalid_message" });

  const day = new Date().toISOString().slice(0, 10);
  const key = `contact:${day}:${await ipKey(request.headers.get("cf-connecting-ip") ?? "unknown", day)}`;
  const used = env.ASK_LIMITS ? Number.parseInt((await env.ASK_LIMITS.get(key)) ?? "0", 10) || 0 : memory.get(key) ?? 0;
  if (used >= PER_IP_PER_DAY) return json(429, { error: "rate_limited" });
  if (env.ASK_LIMITS) await env.ASK_LIMITS.put(key, String(used + 1), { expirationTtl: 60 * 60 * 48 });
  else memory.set(key, used + 1);

  const to = env.CONTACT_TO ?? "hello@moinuddin.app";
  const from = env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio: ${name}`,
      text: `${message}\n\n— ${name} <${email}>\nSent from moinuddin.app`,
      html: `<p style="white-space:pre-wrap;font:15px/1.6 -apple-system,sans-serif">${escape(message)}</p><p style="color:#6b6862;font:13px -apple-system,sans-serif">— ${escape(name)} &lt;${escape(email)}&gt;<br>Sent from moinuddin.app · reply to answer them directly</p>`,
    }),
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    console.error(`contact: resend ${response.status}: ${detail}`);
    // Not 502: Cloudflare swaps 5xx bodies for its own error page, which hid the
    // reason. Resend's error name (e.g. validation_error) is safe to return.
    let reason = "unknown";
    try {
      reason = (JSON.parse(detail) as { name?: string }).name ?? reason;
    } catch {
      // keep "unknown"
    }
    return json(424, { error: "send_failed", reason, status: String(response.status) });
  }
  return json(200, { ok: "sent" });
};
