# mo-portfolio

Personal portfolio for **Moinuddin Shaik**, an Applied Scientist and AI Systems Engineer working across retrieval, evaluation, ML infrastructure, and production AI systems.

**Deployment target:** [mo-portfolio.pages.dev](https://mo-portfolio.pages.dev)

## What this portfolio communicates

The site is designed around technical evidence rather than a traditional skills-first résumé. It presents major projects as engineering case studies, with emphasis on:

- the problem and why it matters;
- system architecture and operating constraints;
- experiments, tradeoffs, and failure modes;
- measurable results;
- lessons and future work.

## Featured work

- **DocuLens AI** — citation-first document intelligence and grounded retrieval.
- **Autonomous Taxonomy Systems at Amazon** — a public-safe summary of self-calibrating extraction, taxonomy induction, and explainability work.
- **Evaluation for Taxonomies at Scale** — research on hierarchical quality and classification across large label spaces.
- **EcoGuardian AI** — fast, offline waste classification for resource-constrained devices.

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
app/                    Pages, metadata, and case-study routes
components/             Interface, motion, and visualization components
lib/portfolio-data.ts   Project narratives and structured portfolio content
public/                 Résumé, fonts, and project imagery
```

## Quality principles

- Responsive, mobile-first layouts
- Keyboard-visible focus states
- Reduced-motion support
- Semantic headings and navigation
- Self-hosted fonts and optimized static assets
- Minimal client-side state

## Contact

- Email: [moinuddinmoin1357@gmail.com](mailto:moinuddinmoin1357@gmail.com)
- GitHub: [CodeWithMoin](https://github.com/CodeWithMoin)
- LinkedIn: [codewithmoin](https://linkedin.com/in/codewithmoin)
