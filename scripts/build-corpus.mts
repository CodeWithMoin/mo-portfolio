/**
 * Writes the chat function's grounding corpus.
 *
 * The Cloudflare Pages Function in functions/ is bundled separately from the Next
 * app and cannot rely on the `@/` path alias, so it reads a plain JSON snapshot.
 * The snapshot is generated from the same typed modules the pages render — one
 * source of truth — and runs before every build (`prebuild`), so the model can
 * never be grounded in content the site no longer shows.
 *
 * It carries the full record (trade-offs, experiments, lessons), not the trimmed
 * text the in-browser retrieval indexes: retrieval wants short distinctive
 * documents, a model wants everything.
 */
import { writeFileSync } from "node:fs";
import { projects, publications } from "../lib/portfolio-data.ts";
import { priorLife, profile, roles, testimonials } from "../lib/profile.ts";
import { results } from "../lib/results.ts";

const site = "https://moinuddin.app";

const corpus = {
  profile: {
    name: profile.name,
    role: profile.role,
    tagline: profile.tagline,
    location: `${profile.location.city}, ${profile.location.country}`,
    education: `${profile.education.degree}, ${profile.education.grade}`,
    currently: profile.currently,
    openTo: profile.openTo,
    focus: profile.focus,
    contact: { email: profile.email, github: profile.links.github, linkedin: profile.links.linkedin, resume: `${site}${profile.links.resume}` },
  },
  experience: roles.map(({ photo: _photo, id: _id, ...role }) => role),
  baselinedResults: results.map((row) => ({ ...row, caseStudy: `${site}/work/${row.slug}` })),
  projects: projects.map(({ visual: _visual, thumbnail: _thumbnail, screenshots: _screenshots, index: _index, ...project }) => ({
    ...project,
    url: `${site}/work/${project.slug}`,
  })),
  publications,
  references: testimonials.map(({ quote: _short, projectSlug: _slug, href: _href, ...reference }) => reference),
  beforeAI: priorLife,
};

writeFileSync(new URL("../functions/corpus.json", import.meta.url), `${JSON.stringify(corpus, null, 2)}\n`);
const chars = JSON.stringify(corpus).length;
console.log(`corpus: ${projects.length} projects, ${roles.length} roles -> functions/corpus.json (~${Math.round(chars / 4)} tokens)`);
