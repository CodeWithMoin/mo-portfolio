# Security hardening design

## Scope and acceptance criteria

Harden the existing static Next.js portfolio and its two Cloudflare Pages Functions without changing the design or removing functionality. Secrets must remain server-only; public endpoints must validate origin, method, content type, body size and shape; expensive calls must have quotas and timeouts; browser responses must carry compatible security headers; deploy artifacts must not contain credentials; and the controls must be repeatably testable.

## Three perspectives

### Frontend

- Preserve the current Ask and contact experiences and their local fallbacks.
- Apply a CSP compatible with the existing inline audience bootstrap, JSON-LD, self-hosted fonts, local images, and same-origin API calls.
- Keep third-party CAPTCHA code out of the normal page path. Turnstile is retained as a documented step-up control if telemetry shows that quota/WAF controls are insufficient.

### Backend

- Keep provider credentials exclusively in Pages encrypted secrets.
- Reject non-POST methods, cross-origin calls, non-JSON bodies, oversized bodies, and malformed fields before upstream work.
- Bound questions, history, model output, request duration, per-visitor use, site-wide daily use, and burst use.
- Return stable generic errors and avoid persisting upstream response bodies in logs.

### Security

- No authentication is appropriate for a public portfolio; authorization is therefore quota- and origin-based rather than identity-based.
- Input is validated server-side even though HTML controls also validate it.
- Model text is rendered as text by React, not as HTML. Contact HTML is entity-escaped.
- Cloudflare KV provides a practical daily budget, but it is eventually consistent. Dashboard rate limiting/WAF controls are the edge layer; a Durable Object is the strict-global option if spend risk increases.
- Static output gets CSP, HSTS, clickjacking, MIME-sniffing, referrer, permissions, and cross-origin isolation headers. Functions send their own headers because Pages `_headers` rules do not apply to Function responses.

## Error and abuse behavior

- Invalid requests receive 4xx JSON without stack traces or provider details.
- Upstream failure or timeout does not disclose bodies or secrets; Ask falls back to local retrieval and contact presents the email fallback.
- Honeypot contact submissions receive a synthetic success so bots get no tuning signal.
- Rate-limited Ask requests fall back to the local, zero-cost retrieval path.

## Verification

- Run content checks, endpoint security checks, TypeScript compilation, production build, and a production dependency audit.
- Scan tracked files and `out/` for secret-like material, environment files, source maps, and sensitive probe paths.
- Inspect `_headers` in the exported artifact.
