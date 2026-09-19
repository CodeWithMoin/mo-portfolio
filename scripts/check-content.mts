/**
 * Content integrity checks.
 *
 * The site derives a lot from typed data — section order, capability groups, stage
 * detail, the answer corpus. Those relationships are invariants, not conventions, so
 * they are asserted here rather than left to be noticed in a screenshot.
 *
 * Run with `npm run check`.
 */
import { existsSync } from "node:fs";
import { capabilities, projectsFor } from "../lib/capabilities.ts";
import { primaryNav, sectionOrder, AUDIENCES } from "../lib/audience.ts";
import { projects, publications } from "../lib/portfolio-data.ts";
import { ask, index } from "../lib/knowledge.ts";
import { buildIndex, search, tokenize, type Doc } from "../lib/retrieval.ts";
import { roles, testimonials } from "../lib/profile.ts";
import { results } from "../lib/results.ts";
import { groups as stackGroups } from "../components/stack-section.tsx";

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "  ok  " : "  FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

console.log("\nsection order");
for (const audience of AUDIENCES) {
  const order = sectionOrder[audience];
  check(`${audience}: no duplicate sections`, new Set(order).size === order.length);
  const dangling = primaryNav[audience].filter((id) => !order.includes(id));
  check(`${audience}: header links all reachable`, dangling.length === 0, dangling.join(", "));
}

console.log("\ncapabilities");
for (const capability of capabilities) {
  // projectsFor throws on an unknown slug; this asserts it resolves and is non-empty.
  check(`${capability.id} resolves`, projectsFor(capability).length === capability.slugs.length);
}
const covered = new Set(capabilities.flatMap((capability) => capability.slugs));
check("every project appears under a capability", projects.every((p) => covered.has(p.slug)),
  projects.filter((p) => !covered.has(p.slug)).map((p) => p.slug).join(", "));

console.log("\nproject data");
for (const project of projects) {
  const stages = Object.keys(project.stageDetails ?? {});
  const unmatched = stages.filter((stage) => !project.architecture.includes(stage));
  check(`${project.slug}: stage keys match architecture`, unmatched.length === 0, unmatched.join(", "));
  check(`${project.slug}: has metrics`, project.metrics.length > 0);
}
for (const publication of publications) {
  if (!publication.caseStudy) continue;
  check(`publication "${publication.title.slice(0, 24)}…" links a real case study`,
    projects.some((p) => p.slug === publication.caseStudy!.slug), publication.caseStudy.slug);
}
for (const role of roles) {
  if (!role.caseStudy) continue;
  check(`role ${role.id} links a real case study`, projects.some((p) => p.slug === role.caseStudy));
}

// A technology on a project but in no stack group renders nowhere, silently.
{
  const grouped = new Set(stackGroups.flatMap((group) => group.members));
  const orphans = [...new Set(projects.flatMap((p) => p.stack))].filter((tech) => !grouped.has(tech));
  check("every project technology belongs to a stack group", orphans.length === 0, orphans.join(", "));
}
for (const row of results) {
  check(`result "${row.metric.slice(0, 26)}" links a real case study`, projects.some((p) => p.slug === row.slug), row.slug);
}
for (const testimonial of testimonials) {
  check(`testimonial ${testimonial.name} attaches to a real case study`,
    projects.some((p) => p.slug === testimonial.projectSlug), testimonial.projectSlug);
}
// A typo in an image path renders as a broken image, not a build error — so the file
// has to be looked for on disk.
const onDisk = (src: string) => existsSync(new URL(`../public${src}`, import.meta.url));
for (const project of projects) {
  for (const shot of project.screenshots ?? []) {
    check(`${project.slug}: screenshot path is public`, shot.src.startsWith("/work/"), shot.src);
    check(`${project.slug}: screenshot exists (${shot.src})`, onDisk(shot.src), shot.src);
    check(`${project.slug}: screenshot has alt text`, shot.alt.trim().length > 10, shot.src);
  }
  if (project.thumbnail) {
    check(`${project.slug}: thumbnail exists`, onDisk(project.thumbnail.src), project.thumbnail.src);
    if (project.thumbnail.hoverSrc) check(`${project.slug}: hover thumbnail exists`, onDisk(project.thumbnail.hoverSrc), project.thumbnail.hoverSrc);
  }
}

// Reported, not asserted: a new project should be able to land before every stage
// is written up. A partial count here is a nudge, not a build failure.
const documented = projects.filter((p) => Object.keys(p.stageDetails ?? {}).length === p.architecture.length);
const stages = projects.reduce((sum, p) => sum + p.architecture.length, 0);
// The retrieval engine is hand-written, so its properties are asserted rather than
// assumed. A silently wrong cosine would degrade the agent without failing a build.
console.log("\nretrieval math");
{
  const doc = (id: string, title: string, body: string): Doc => ({ id, kind: "project", title, snippet: "", body });
  const probe = buildIndex([
    doc("a", "alpha", "retrieval citations evidence grounding"),
    doc("b", "beta", "temporal durable workflow compensation"),
    doc("c", "gamma", "retrieval ranking embeddings vectors"),
  ]);

  const identical = search(probe, "alpha retrieval citations evidence grounding", 1)[0];
  check("cosine is exactly 1 for identical text", Math.abs(identical.score - 1) < 1e-9, identical.score.toFixed(12));

  const scores = ["retrieval", "temporal", "ranking vectors"].flatMap((q) => search(probe, q, 3));
  check("every score lies within [0,1]", scores.every((h) => h.score >= 0 && h.score <= 1 + 1e-12));

  const hit = search(probe, "retrieval ranking evidence", 1)[0];
  const summed = hit.terms.reduce((sum, term) => sum + term.contribution, 0);
  check("per-term contributions sum to the score", Math.abs(summed - hit.score) < 1e-12);

  const skew = buildIndex([doc("x", "x", "shared rare1"), doc("y", "y", "shared rare2"), doc("z", "z", "shared rare3")]);
  check("a rare term outweighs a ubiquitous one", (skew.idf.get("rare1") ?? 0) > (skew.idf.get("shared") ?? 0));

  check("stopwords are dropped", !tokenize("the and of a system").includes("the"));
  check("plurals fold to singular", tokenize("systems")[0] === tokenize("system")[0]);
  check("an empty query returns nothing", search(probe, "   ").length === 0);
  check("out-of-vocabulary terms return nothing", search(probe, "zzzz qqqq").length === 0);
}

console.log(`\nstage coverage — ${documented.length}/${projects.length} projects, ${stages} stages total`);
for (const p of projects.filter((p) => !documented.includes(p))) {
  console.log(`  note  ${p.slug}: ${Object.keys(p.stageDetails ?? {}).length}/${p.architecture.length} stages documented`);
}

console.log(`\nanswer layer (${index.docs.length} docs / ${index.idf.size} terms)`);
const answerable = [
  "citations that survive retrieval", "durable execution temporal", "essay grading qwk",
  "badminton nationals", "what is decode", "does he know distributed systems",
  "tell me about his education", "is he available", "can he do frontend",
  "what did he build at amazon", "how do I contact him", "whoami", "ls",
];
const refusable = ["pineapple pizza recipe", "the weather today", "quantum blockchain nft"];
for (const q of answerable) check(`answers: "${q}"`, ask(q).via !== "none");
// The whole premise is that it cannot answer what it cannot source.
for (const q of refusable) check(`refuses: "${q}"`, ask(q).via === "none");

console.log(failures === 0 ? "\nAll content checks passed.\n" : `\n${failures} check(s) failed.\n`);
process.exit(failures === 0 ? 0 : 1);
