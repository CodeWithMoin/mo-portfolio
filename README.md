# mo-portfolio

Personal portfolio for **Moinuddin Shaik**, an Applied Scientist and AI Systems Engineer working across retrieval, evaluation, ML infrastructure, and production AI systems.

**Deployment target:** [moinuddin.app](https://moinuddin.app)

## What this portfolio communicates

The site is built around technical evidence rather than a skills-first résumé. Projects are written as engineering case studies covering the problem, the operating constraint, the architecture, the experiments and tradeoffs, and the measured result.

## Two modes

The site runs in one of two modes, chosen by the visitor and persisted to `localStorage`:

| | Recruiter (default) | Founder |
| --- | --- | --- |
| Leads with | Amazon metrics, experience, research | What he ships, and how far he takes it alone |
| Project copy | `summary` — what the system is | `thesis` — the call behind it |
| Featured work | Amazon, MarkAlign, taxonomy research, DocuLens | Decode, DocuLens, Trellis, MarkAlign |
| Section order | Work → Experience → Stack → Research → Lab | Work → What he builds → Lab → Before AI |

`lib/audience.ts` is the single source of truth for mode names, section order, and header links. Sections reorder through CSS `order`, so nothing unmounts on a switch — no lost scroll, no replayed animation — and every section stays in the server-rendered HTML for crawlers regardless of mode.

Any mode is shareable as a link: `?v=founder`. The former `?v=startup` spelling still resolves.

## Ask, and the retrieval behind it

`lib/retrieval.ts` is a dependency-free TF-IDF index with cosine ranking, built at module load from the site's own content. `lib/knowledge.ts` layers curated intents over it.

There is no model call anywhere in this path, and no API key. An answer is either a matched intent, a retrieved document, or an explicit miss — the agent will not generate text it cannot source, and it says which of the three it did. The **Lab** section exposes the same index with the arithmetic visible: tokens, idf weights, cosine scores, and per-term contributions, recomputed as you type.

## Featured work
## Stack

- Next.js 15 with the App Router
- React 19 and TypeScript
- Tailwind CSS
- Framer Motion
- Self-hosted Geist Sans and Geist Mono
- Static export for Cloudflare Pages

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Chat (optional LLM)

The side chat (the **Ask** button, bottom right) works with no backend: it answers from the in-browser retrieval index. Deploying the Cloudflare Pages Function in `functions/api/ask.ts` upgrades it to a streamed, multi-turn chat with Claude, grounded in the full portfolio record (`functions/corpus.json`, regenerated from the typed data before every build).

1. In Cloudflare Pages → Settings → Environment variables, add **one** secret, encrypted, only ever read server-side:
   - `GEMINI_API_KEY` — from [Google AI Studio](https://aistudio.google.com). Free tier with implicit prefix caching; the default choice.
   - `NVIDIA_API_KEY` — from [build.nvidia.com](https://build.nvidia.com). Free, but its tier streams the full record slowly.
   - `ANTHROPIC_API_KEY`.
   With more than one set, the order is Gemini → NVIDIA → Anthropic, or pin one with `ASK_PROVIDER`.
2. Optional: `ASK_MODEL` — the model id. Defaults: `gemini-3.5-flash-lite` on Gemini (fast; the full Flash models are often at capacity on the free tier), `nvidia/nemotron-3.5-lightning-30b-a3b` on NVIDIA, `claude-opus-5` on Anthropic. Use the exact id from the model's page on build.nvidia.com; NIM retires ids (a 410 in the Pages log names the date), so change this rather than the code when that happens. To try a provider locally without deploying, put the key in `.env.local` and run `npx tsx scripts/ask-live.mts "a question"`.
3. **Quota.** Create a KV namespace (Workers & Pages → KV) and bind it to the Pages project as `ASK_LIMITS` (Settings → Functions → KV namespace bindings). With it bound, each visitor gets **10 questions per UTC day** and the whole site **300**; change either with `ASK_DAILY_LIMIT` / `ASK_GLOBAL_DAILY_LIMIT`; `ASK_MINUTE_LIMIT` (default 8, under Gemini's free-tier 10/min) caps bursts across all visitors so a spike never trips the provider's own per-minute limit. IPs are never stored — the key is a SHA-256 of the IP salted with the date. Without the binding the counters live in one isolate's memory and only slow a burst, so bind it before sharing the link. When a visitor's quota is spent the endpoint answers 429 and the chat says so and keeps answering from the in-browser index.

### Contact form

`functions/api/contact.ts` sends the closing panel's form through [Resend](https://resend.com). Set `RESEND_API_KEY` (secret). Optional: `CONTACT_TO` (default `hello@moinuddin.app`) and `CONTACT_FROM` (default `Portfolio <contact@moinuddin.app>`; the domain is verified in Resend, DNS on Cloudflare). Guardrails: same-origin + JSON, 8 KB cap, field validation, honeypot, minimum time-on-page, 3 messages per IP per day (shares the `ASK_LIMITS` KV). Replies go straight to the sender via `reply_to`. Without a key the form tells visitors to email instead.

Guardrails in `functions/api/ask.ts`, in the order a request meets them: same-origin + JSON-only + 24 KB body cap; strict shape validation (600-char questions, 8 turns); the quotas above; a narrow injection screen that declines without calling the model (and screens forged assistant history too); a system prompt that scopes the model to the portfolio, forbids revealing itself or dumping the corpus, and refuses to speak for Moin on salary, availability, or visa questions; a 700-token output cap; model refusals turned into one plain sentence.

Without the secret the function answers `503`, the client notices once, and the chat falls back to local retrieval for the rest of the session. Each answer is labelled with the path that produced it.

Cost shape: the ~14K-token corpus is a cached system prompt, so a warm question costs roughly a cent on the default model; the first question after five idle minutes pays the cache write (~9¢).

## Content checks

```bash
npm run check
```

Asserts the invariants the site derives from data, plus the properties of the hand-written retrieval engine (cosine reaches exactly 1 on identical text, scores stay in [0,1], per-term contributions sum to the score, rare terms outweigh ubiquitous ones): every header link resolves to a section the current mode actually shows, every capability resolves to real projects, every `stageDetails` key matches a stage in that project's architecture, publications and roles link to case studies that exist, and the answer layer still answers what it should and refuses what it cannot source.

## Production build

```bash
npm run build
```

The production site is exported to `out/`.

## Cloudflare Pages

Use these settings when importing the repository into Cloudflare Pages:

| Setting | Value |
| --- | --- |
| Project name | `mo-portfolio` |
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node.js version | `22` |

The Next.js configuration uses static export, unoptimized local images, and generated static routes for every case study.

## Project structure

```text
app/                    Pages, metadata, JSON-LD, and case-study routes
components/             Interface, motion, and visualization components
lib/audience.ts         Mode definitions, section order, header links
lib/portfolio-data.ts   Project case studies and structured content
lib/profile.ts          Identity, roles, testimonials, prior work
lib/capabilities.ts     Capability groups, resolved to projects by slug
lib/retrieval.ts        TF-IDF index and cosine ranking
lib/knowledge.ts        Answer corpus and intents over that index
lib/results.ts          Baselined results table
lib/ask-remote.ts       Client for the optional chat endpoint
functions/api/ask.ts    Cloudflare Pages Function: grounded Claude chat
scripts/                Corpus generation and content checks
public/                 Résumé, fonts, and project imagery
```

## Quality principles

- Content lives in typed modules; components render it and never restate it. A capability referencing a removed project throws at build rather than rendering an empty card.
- Responsive layouts verified at 320 / 375 / 430 / 768 / 1440 with no horizontal overflow at any width; keyboard-visible focus states, a skip link, and roving arrow-key navigation in the architecture diagrams.
- Reduced-motion support throughout; with animation disabled the page still reads in full.
- Semantic headings and navigation, JSON-LD `Person` schema.
- Self-hosted fonts, no third-party requests, no analytics.
- Minimal client-side state and no runtime data fetching — the whole site is static.

## Keyboard

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Open the command bar |
| `/` | Same, without the browser fighting you for `⌘K` |
| `↑` `↓` `⏎` | Move and select |
| `esc` | Close, or step back from an answer |

Typing `whoami`, `ls`, or `help` into the chat does something. So does the Konami code.

## Contact

- Email: [hello@moinuddin.app](mailto:hello@moinuddin.app)
- GitHub: [CodeWithMoin](https://github.com/CodeWithMoin)
- LinkedIn: [codewithmoin](https://linkedin.com/in/codewithmoin)
