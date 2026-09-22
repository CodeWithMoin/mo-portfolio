/**
 * Client for POST /api/ask (functions/api/ask.ts).
 *
 * The endpoint only exists where the Cloudflare function is deployed with a key. In
 * local dev, on a plain static host, or without the secret, it is simply absent —
 * so "unavailable" is a normal state, not an error. The caller falls back to the
 * in-browser retrieval, and the result is remembered for the session so later
 * questions do not pay for a doomed round trip.
 */
export type ChatTurn = { role: "user" | "assistant"; content: string };

/**
 * "limited" is the endpoint's daily quota (per visitor, or the site-wide budget). It
 * is not an error either: the caller falls back the same way, and says why.
 */
export type RemoteResult = "answered" | "unavailable" | "limited";

let availability: "unknown" | "available" | "unavailable" | "limited" = "unknown";

export const remoteAvailability = () => availability;

/**
 * Streams an answer, calling `onText` with the accumulated text so far.
 * Resolves "answered" once a response has streamed, even a partial one; otherwise
 * nothing was shown and the caller should fall back.
 */
/** Which model answered, from the endpoint's header, for the badge on the answer. */
export type RemoteMeta = { provider: string };

export async function askRemote(messages: ChatTurn[], onText: (text: string, meta: RemoteMeta) => void, signal?: AbortSignal): Promise<RemoteResult> {
  // Both are remembered for the session: no point paying a round trip to be told again.
  if (availability === "unavailable" || availability === "limited") return availability;

  let response: Response;
  try {
    response = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch {
    if (!signal?.aborted) availability = "unavailable";
    return "unavailable";
  }

  if (response.status === 429) {
    availability = "limited";
    return "limited";
  }

  // A static host answers 404/405 with an HTML page; an unconfigured function
  // answers 503. Either way there is no model behind this origin.
  const isStream = response.headers.get("content-type")?.startsWith("text/plain");
  if (!response.ok || !isStream || !response.body) {
    if (response.status !== 400) availability = "unavailable";
    return "unavailable";
  }

  availability = "available";
  const meta: RemoteMeta = { provider: response.headers.get("x-ask-provider") ?? "model" };
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      onText(text, meta);
    }
  } catch {
    // Dropped mid-stream: keep what arrived rather than discarding a partial answer.
  }
  return text.length > 0 ? "answered" : "unavailable";
}
