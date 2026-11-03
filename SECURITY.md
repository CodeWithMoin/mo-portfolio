# Security audit and deployment guide

Audit date: 2026-11-03. Scope: the repository, its static `out/` deployment, Cloudflare Pages Functions, Gemini integration, contact endpoint, build configuration, and production dependencies. The Cloudflare account itself was not connected to this session, so dashboard changes below must be applied by the account owner.

## Executive summary

The observed traffic is commodity secret/configuration scanning, not evidence by itself that a credential was retrieved. The requested paths are absent from the repository's deployable static output, and no provider key is present in tracked source. A 404 alone would not establish that; the production build and artifact scan do.

The most material risks were preventable future secret commits, missing browser security headers, incomplete timeout/error hygiene on public Functions, approximate application-only abuse controls, and vulnerable build/runtime packages. These are hardened in code. Cloudflare edge rules remain necessary because rejecting thousands of probes at the edge is cheaper and gives better telemetry than serving origin 404s.

## Findings

| Severity | Finding | Exploit and disposition |
| --- | --- | --- |
| Critical | Current dependency advisories in Next.js | Affected releases had critical/high server and image-processing advisories. This site is a static export with unoptimized images and no Next server, which reduced direct reachability, but the packages were upgraded rather than relying on deployment shape. |
| High | Public AI endpoint can spend a shared provider quota | Automated POSTs could exhaust Gemini RPM/RPD or create charges. Existing per-IP, global daily and burst limits were retained; request/method/body/output/time bounds were tightened. Bind `ASK_LIMITS` and add the edge rate-limit rule below before production. |
| High | Secret-file ignore patterns were incomplete | `.env.production`, `.env.preview`, and `.dev.vars` could have been committed accidentally, then retrieved from Git history or a mistaken build artifact. `.env*`, `.dev.vars*`, Wrangler state, keys and certificates are now ignored. No such file is tracked now. |
| Medium | Static pages lacked an explicit CSP and clickjacking policy | An injection bug would have had fewer browser-level constraints, and the site could be framed for UI redress. `_headers` now adds CSP, frame denial, HSTS, MIME, referrer, permissions and cross-origin policies. |
| Medium | Function responses did not receive the static header policy | Pages `_headers` does not apply to Function responses. Both endpoints now set restrictive API-specific headers directly. |
| Medium | Contact upstream call had no timeout | A stalled Resend call could hold a Function invocation open and consume capacity. It now fails closed after 10 seconds and the UI retains the email fallback. |
| Medium | Provider error bodies were persisted in logs | Upstream diagnostics can sometimes contain request fragments. Logs now keep only provider/status/error class; public errors are generic. The Ask model identifier is no longer returned. |
| Medium | KV quotas are eventually consistent | Parallel requests or requests landing in different locations may overshoot. This is acceptable as a secondary daily budget, not as the only edge control. Use Cloudflare's rate-limiting rule; use a Durable Object if a strict global monetary limit becomes necessary. |
| Low | Prompt injection can influence a public model | The model sees untrusted conversation history. A narrow pre-screen and a fixed system/corpus boundary reduce abuse, output is text-rendered, and the client cannot choose system text/model parameters/token count. Model instructions are not a confidentiality boundary, so the corpus contains only public data. |
| Low | Same-origin checks are defense in depth only | Non-browser clients can forge `Origin`. Exact-origin checks stop cross-site browser freeloading, while edge limits and server quotas carry the abuse-control burden. |

No authentication, cookie session, database query, file upload, URL fetch based on user input, or server-side HTML rendering exists in scope. Consequently CSRF, SQL injection, SSRF and path traversal do not currently expose an application sink. Contact message HTML is entity-escaped; chat text is rendered by React as text, not injected HTML.

## Suspicious traffic assessment

The scanner requested common deployment mistakes: dotenv files, Git metadata, WordPress configuration and backup files. In this project:

- `.env*`, `.dev.vars*`, `.git/`, source files and repository metadata are not copied into `out/`.
- Cloudflare Pages deploys `out/` plus the separately compiled `functions/` routes; it does not publish the repository root.
- `wp-config.php` and `services/environments.ini` do not exist.
- A successful `200`, `206`, cached body, redirect to an object store, or a custom 404 that embedded requested content would require incident response. The supplied data reports 404s, but verify a sample in Security Analytics and with the post-deploy commands below.
- If any probe ever returned secret contents, rotate that credential first, then purge cache, remove it from current/history artifacts, and review provider/Cloudflare audit logs. Deleting the file alone is insufficient.

## Required secrets and bindings

Set these in Workers & Pages → the Pages project → Settings → Variables and Secrets. Use **Encrypt** for every API key. Configure production and preview independently.

| Name | Type | Required | Purpose |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | encrypted secret | one AI provider only | Default Ask provider |
| `NVIDIA_API_KEY` | encrypted secret | alternative | NVIDIA Ask provider |
| `ANTHROPIC_API_KEY` | encrypted secret | alternative | Anthropic Ask provider |
| `RESEND_API_KEY` | encrypted secret | for contact form | Sends contact email |
| `ASK_LIMITS` | KV binding | production | Shared daily/burst counters |
| `ASK_PROVIDER` | plain variable | optional | Pin configured provider |
| `ASK_MODEL` | plain variable | optional | Pin model ID |
| `ASK_DAILY_LIMIT` | plain variable | recommended | Per-visitor UTC daily cap; default 10 |
| `ASK_GLOBAL_DAILY_LIMIT` | plain variable | recommended | Whole-site UTC daily cap; default 300 |
| `ASK_MINUTE_LIMIT` | plain variable | recommended | Application burst cap; default 8 |
| `CONTACT_TO` / `CONTACT_FROM` | plain variables | optional | Mail routing identities |

Never use a `NEXT_PUBLIC_` name for a provider key. Rotate any key that has ever appeared in client JavaScript, Git history, a pasted log, or a public build artifact.

## Cloudflare dashboard configuration

### 1. WAF custom rule: probes and known scanner

Security → WAF → Custom rules → Create rule. Action: **Block**. Expression:

```text
starts_with(lower(http.request.uri.path), "/.git") or
starts_with(lower(http.request.uri.path), "/.env") or
starts_with(lower(http.request.uri.path), "/services/environments") or
lower(http.request.uri.path) contains "wp-config" or
http.user_agent eq "TLM-Audit-Scanner/2.0"
```

This uses one of the five custom rules currently available on Free. Avoid a country rule: the evidence identifies a scanner, not a malicious country, and international visitors are legitimate. A temporary IP Access block for `93.123.109.247` is reasonable while the scan is active, but the path/UA rule is the durable control because IPs rotate.

### 2. Rate-limit rule: dynamic endpoints only

Security → WAF → Rate limiting rules. The Free plan currently includes one rule. Match:

```text
(http.request.uri.path eq "/api/ask" or http.request.uri.path eq "/api/contact") and http.request.method eq "POST"
```

Start at **10 requests per minute per IP**, action **Managed Challenge** (or Block if challenge is unavailable in the selected plan UI), and review Security Events after 48 hours. This deliberately excludes static assets. Application limits remain lower/more specific: Ask has a global provider burst cap and both endpoints have daily per-visitor limits.

### 3. Managed rules and bots

- Confirm the **Cloudflare Free Managed Ruleset** is active. The broader Cloudflare Managed and OWASP rulesets require a paid plan; do not assume they are available on Free.
- Enable **Bot Fight Mode** only after noting that Free Bot Fight Mode is domain-wide and cannot be bypassed with an allow rule. Review crawler/link-preview behavior (Google, Bing, LinkedIn, Slack) and Security Events. Turn it back off if it challenges legitimate API/preview traffic. Super Bot Fight Mode's exceptions require Pro or above.
- Do not use “Block AI Bots” if discoverability by AI/search crawlers is desired; it is separate from protecting the Ask endpoint.

### 4. Pages domains and previews

- Create a Bulk Redirect from the production `<project>.pages.dev` hostname to `https://moinuddin.app`, preserving query strings and path suffixes.
- `_headers` adds `noindex, nofollow` to pages.dev and branch preview hostnames as a second layer.
- Do not bind production provider secrets to preview unless preview chatbot access is explicitly required. The local retrieval fallback keeps previews functional without them.
- Keep production branch `main`, build command `npm run build`, output `out`, Node 22.

### 5. Turnstile decision

Turnstile was evaluated but not placed in every normal chat interaction. The present UI is fast, no-third-party-by-default, and already has edge/application quotas; an always-on widget adds script/CSP surface and may challenge legitimate users. Add managed Turnstile as a step-up control if Security Events show distributed abuse bypassing IP limits. If enabled, the Pages Function must call Siteverify server-side, validate hostname/action, impose a timeout, and treat tokens as five-minute, single-use values. Client-only validation provides no protection.

## Deployment

1. Review the diff and ensure no unrelated user changes are included.
2. Run `npm ci`, `npm run check`, `npm run check:security`, `npx tsc --noEmit`, and `npm run build`.
3. Run `npm audit --omit=dev`; document any accepted build-only advisory and its deployment reachability.
4. Confirm `out/_headers` exists, no `.map` files are exported, and no secret patterns or sensitive probe files occur in `out/`.
5. Configure the secrets/bindings and dashboard controls above before merging/pushing to the production branch. A Git-connected Pages project deploys the pushed `main` commit automatically.
6. After deployment, verify:

```bash
curl -I https://moinuddin.app/
curl -i https://moinuddin.app/.env
curl -i https://moinuddin.app/.git/config
curl -i https://moinuddin.app/wp-config.php
curl -i https://moinuddin.app/api/ask
curl -i -X POST -H 'Origin: https://attacker.example' -H 'Content-Type: application/json' --data '{"messages":[{"role":"user","content":"hello"}]}' https://moinuddin.app/api/ask
```

Expected: security headers on `/`; no sensitive body on probe paths; `405` plus `Allow: POST` for GET `/api/ask`; `403` for the forged cross-origin POST. Then submit one legitimate Ask and contact request in the browser and confirm the UI, email delivery, local fallback, and Security Events.

## Remaining risks

- Neither KV nor standard Cloudflare rate limiting is a strict worldwide counter. Durable Objects are the strict option if unexpected spend becomes material.
- The production dependency audit is the deployment gate. Development-only ESLint/glob advisories may remain in npm's full audit; they process trusted repository patterns during local linting and are not shipped in `out/` or the Pages Functions. Keep the toolchain updated and do not lint attacker-supplied repositories in this workspace.
- Gemini free-tier limits are per project and model across RPM/TPM/RPD; verify the live values in AI Studio. Free does not mean unlimited.
- CSP retains `unsafe-inline` for scripts/styles because the current Next export contains a small inline audience bootstrap, JSON-LD and inline styling. Removing it would require a nonce/hash-capable response layer or refactoring; the rest of the CSP is same-origin and restrictive.
- The portfolio corpus is sent to the chosen AI provider. It must remain public-only. Prompt controls reduce misuse but cannot make model-visible text secret.
- Cloudflare dashboard state and live production headers were not mutable from this repository session; the post-deploy checks are mandatory.
