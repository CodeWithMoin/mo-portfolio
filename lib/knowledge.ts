import { profile, roles, priorLife, testimonials } from "@/lib/profile";
import { projects, publications } from "@/lib/portfolio-data";
import { buildIndex, search, type Doc, type Scored } from "@/lib/retrieval";

/**
 * The corpus behind "Ask Moin".
 *
 * Every document is assembled from data already in this repo. The agent can only
 * return text that exists here, which is the whole point: it cannot invent a
 * project, a metric, or a job. When nothing scores, it says so instead of guessing.
 */
const docs: Doc[] = [
  ...projects.map<Doc>((project) => ({
    id: `project:${project.slug}`,
    kind: "project",
    title: project.title,
    href: `/work/${project.slug}`,
    snippet: project.summary,
    body: [
      project.title,
      project.title,
      project.eyebrow,
      project.eyebrow,
      project.thesis,
      project.role,
      project.problem,
      project.why,
      project.stack.join(" "),
      project.architecture.join(" "),
      project.results.join(" "),
      project.metrics.map((m) => `${m.value} ${m.label}`).join(" "),
    ].join(" "),
  })),
  ...roles.map<Doc>((role) => ({
    id: `role:${role.id}`,
    kind: "role",
    title: `${role.title} · ${role.company}`,
    href: role.caseStudy ? `/work/${role.caseStudy}` : "/#experience",
    snippet: role.built,
    body: [
      role.company,
      role.company,
      role.org,
      role.title,
      role.title,
      role.period,
      role.location,
      role.problem,
      role.built,
      role.approach.join(" "),
      role.outcomes.map((o) => `${o.value} ${o.label}`).join(" "),
      role.note ?? "",
    ].join(" "),
  })),
  ...publications.map<Doc>((publication) => ({
    id: `research:${publication.title}`,
    kind: "research",
    title: publication.title,
    href: "/#research",
    snippet: `${publication.role}, ${publication.venue} — ${publication.status}.`,
    body: [publication.venue, publication.role, publication.status, publication.abstract].join(" "),
  })),
  ...priorLife.map<Doc>((entry) => ({
    id: `background:${entry.id}`,
    kind: "background",
    title: entry.headline,
    href: "/#background",
    snippet: entry.headline,
    body: [entry.detail, entry.stats.map((s) => `${s.value} ${s.label}`).join(" ")].join(" "),
  })),
  {
    id: "profile:identity",
    kind: "profile",
    title: "Who Moin is",
    href: "/#work",
    snippet: `${profile.role} in ${profile.location.city}, ${profile.location.country}. ${profile.tagline}`,
    body: [
      profile.name,
      profile.role,
      profile.tagline,
      profile.currently,
      profile.focus.join(" "),
      profile.fullName,
      profile.education.degree,
      profile.education.grade,
      profile.education.institution,
      profile.education.period,
      profile.honors.join(" "),
      Object.values(profile.skills).flat().join(" "),
      "education degree university college studied graduated btech skills languages",
      profile.openTo,
      "contact email hire hiring available availability resume cv linkedin github",
    ].join(" "),
  },
];

export const index = buildIndex(docs);

export type Source = { label: string; href: string };
export type Answer = {
  text: string;
  bullets?: string[];
  sources: Source[];
  /** How this answer was produced. Surfaced to the visitor rather than hidden. */
  via: "matched" | "retrieved" | "none";
  /** Scoring internals, when retrieval produced the answer. */
  scored?: Scored[];
};

const byslug = (slug: string) => projects.find((project) => project.slug === slug);
const link = (slug: string): Source => ({ label: byslug(slug)!.title, href: `/work/${slug}` });

/** Curated questions. Each answer is assembled from data, never authored freehand. */
type Intent = { id: string; match: RegExp; suggested?: string; build: () => Answer };

const amazon = roles.find((role) => role.id === "amazon")!;

const intents: Intent[] = [
  {
    id: "amazon",
    match: /\bamazon\b|\binternship\b|\bapplied scientist\b/i,
    suggested: "What did he build at Amazon?",
    build: () => ({
      text: `${amazon.title}, ${amazon.company} ${amazon.org} (${amazon.period}, ${amazon.location}). ${amazon.built}`,
      bullets: amazon.outcomes.map((outcome) => `${outcome.value} — ${outcome.label}`),
      sources: [link("amazon-applied-science"), { label: "Experience", href: "/#experience" }],
      via: "matched",
    }),
  },
  {
    id: "shipped",
    match: /\bshipped\b|\bbuilt\b|\bactually\b|\bproduction\b|\brepos?\b|\bgithub\b/i,
    suggested: "What has he actually shipped?",
    build: () => ({
      text: "Public, running code — not slide decks. Each of these has a case study and, where it is open source, a repository.",
      bullets: [
        `${byslug("doculens-ai")!.title} — ${byslug("doculens-ai")!.summary}`,
        `${byslug("markalign")!.title} — live demo, ${byslug("markalign")!.metrics[0].value} ${byslug("markalign")!.metrics[0].label}.`,
        `${byslug("trellis")!.title} — ${byslug("trellis")!.metrics[0].value} ${byslug("trellis")!.metrics[0].label}.`,
        `${byslug("smart-turn")!.title} — ${byslug("smart-turn")!.summary}`,
      ],
      sources: [link("doculens-ai"), link("markalign"), link("trellis"), { label: "GitHub", href: profile.links.github }],
      via: "matched",
    }),
  },
  {
    id: "interesting",
    match: /\b(most|technically) (interesting|impressive|complex|difficult)\b|\bbest project\b|\bflagship\b/i,
    suggested: "Show me the most technically interesting project",
    build: () => ({
      text: `${byslug("decode")!.title}. ${byslug("decode")!.thesis}`,
      bullets: [
        byslug("decode")!.problem,
        `Architecture: ${byslug("decode")!.architecture.join(" → ")}`,
      ],
      sources: [link("decode"), link("markalign")],
      via: "matched",
    }),
  },
  {
    id: "ml",
    match: /\bml\b|\bmachine learning\b|\bai\/ml\b|\bmodels?\b|\btraining\b|\bresearch\b|\bpapers?\b|\bpublications?\b/i,
    suggested: "Show me his AI/ML work",
    build: () => ({
      text: "Two submitted papers and three systems where the modelling was the hard part.",
      bullets: [
        ...publications.map((p) => `${p.title} — ${p.role}, ${p.venue}, ${p.status}.`),
        `${byslug("smart-turn")!.title} — ${byslug("smart-turn")!.metrics.map((m) => `${m.value} ${m.label}`).join(", ")}.`,
        `${byslug("markalign")!.title} — ${byslug("markalign")!.metrics[0].value} ${byslug("markalign")!.metrics[0].label}.`,
      ],
      sources: [{ label: "Research", href: "/#research" }, link("smart-turn"), link("markalign")],
      via: "matched",
    }),
  },
  {
    id: "stack",
    match: /\btech(nolog|nical)?\b|\bstack\b|\blanguages?\b|\btools?\b|\bskills?\b|\bframeworks?\b|\bfrontend\b|\bbackend\b|\breact\b|\bpython\b/i,
    suggested: "What does he build with?",
    build: () => {
      const all = [...new Set(projects.flatMap((project) => project.stack))];
      return {
        text: `Everything below appears in at least one shipped project: ${all.join(", ")}.`,
        sources: [{ label: "What I build", href: "/#build" }, { label: "GitHub", href: profile.links.github }],
        via: "matched",
      };
    },
  },
  {
    id: "hiring",
    match: /\bhiring\b|\brole\b|\bjob\b|\bopen to\b|\blooking for\b|\bposition\b|\binterview\b|\bwhy should\b|\bavailable\b|\bavailability\b/i,
    suggested: "I'm hiring for an AI engineer",
    build: () => ({
      text: `Open to ${profile.openTo}. Currently: ${profile.currently}.`,
      bullets: [
        `${amazon.outcomes[0].value} ${amazon.outcomes[0].label}, at Amazon.`,
        `${publications[0].role} on ${publications[0].title} (${publications[0].venue}, ${publications[0].status}).`,
        `${profile.education.degree}, ${profile.education.grade}.`,
        testimonials[0].quote,
      ],
      sources: [
        { label: "Résumé", href: profile.links.resume },
        { label: "Email", href: profile.links.email },
        { label: "LinkedIn", href: profile.links.linkedin },
      ],
      via: "matched",
    }),
  },
  {
    id: "founder",
    match: /\bfounder\b|\bstartup\b|\bzero to one\b|\bcofounder\b|\bco-founder\b|\bship(ping)? velocity\b/i,
    suggested: "I'm a founder looking for a technical builder",
    build: () => ({
      text: "Takes an idea to a running system alone: product decision, architecture, model work, backend, and the interface.",
      bullets: [
        `${byslug("decode")!.title} — multi-agent system with deterministic visual execution, built solo.`,
        `${byslug("doculens-ai")!.title} — full stack plus retrieval evaluation, MIT licensed with CI and runbooks.`,
        `${byslug("trellis")!.title} — durable execution, compensation, and queue isolation.`,
        "Before engineering: 200+ video clients found and delivered solo from age 15.",
      ],
      sources: [link("decode"), link("doculens-ai"), { label: "Email", href: profile.links.email }],
      via: "matched",
    }),
  },
  {
    id: "education",
    match: /\beducation\b|\bdegree\b|\buniversity\b|\bcollege\b|\bstudied\b|\bgpa\b|\bcgpa\b|\bgraduat/i,
    suggested: "What's his background?",
    build: () => ({
      text: `${profile.education.degree}, ${profile.education.institution}, ${profile.education.location} (${profile.education.period}) — GPA ${profile.education.grade}.`,
      bullets: [
        ...profile.honors,
        `${amazon.note}`,
        `${publications[0].role} on ${publications[0].title} (${publications[0].venue}, ${publications[0].status}).`,
      ],
      sources: [{ label: "Résumé", href: profile.links.resume }, { label: "Research", href: "/#research" }],
      via: "matched",
    }),
  },
  {
    id: "contact",
    match: /\bcontact\b|\breach\b|\bemail\b|\bhire him\b|\bget in touch\b|\bconnect\b/i,
    suggested: "How do I contact him?",
    build: () => ({
      text: `${profile.email} — or LinkedIn. Based in ${profile.location.city}, ${profile.location.country}.`,
      sources: [
        { label: profile.email, href: profile.links.email },
        { label: "LinkedIn", href: profile.links.linkedin },
        { label: "Résumé", href: profile.links.resume },
      ],
      via: "matched",
    }),
  },
];

export const suggestedQuestions = intents
  .filter((intent) => intent.suggested)
  .map((intent) => ({ id: intent.id, question: intent.suggested! }));

/**
 * Intent match first, then real retrieval over the corpus, then an honest miss.
 * There is no generation step anywhere in this path.
 */
/**
 * Terminal-shaped shortcuts. The input already looks like a prompt, so a few people
 * will try these — and finding that they work is the reward. Undocumented on purpose.
 */
const consoleCommands: Record<string, () => Answer> = {
  whoami: () => ({
    text: `${profile.name} — ${profile.role}, ${profile.location.city}. ${profile.tagline}`,
    bullets: [`Currently: ${profile.currently}`, `Open to: ${profile.openTo}`, `${profile.education.degree}, ${profile.education.grade}`],
    sources: [{ label: "Résumé", href: profile.links.resume }, { label: "GitHub", href: profile.links.github }],
    via: "matched",
  }),
  ls: () => ({
    text: `${projects.length} projects, newest first.`,
    bullets: projects.map((project) => `${project.index}  ${project.title} — ${project.eyebrow}`),
    sources: [{ label: "All work", href: "/#work" }],
    via: "matched",
  }),
  help: () => ({
    text: "Ask in plain language, or try: whoami · ls · stack · contact.",
    bullets: suggestedQuestions.map((suggestion) => suggestion.question),
    sources: [],
    via: "matched",
  }),
};

export function ask(query: string): Answer {
  const trimmed = query.trim();
  if (!trimmed) return { text: "Ask about a project, the Amazon work, the research, or how to get in touch.", sources: [], via: "none" };

  const command = consoleCommands[trimmed.toLowerCase().replace(/^[$>]\s*/, "")];
  if (command) return command();

  for (const intent of intents) {
    if (intent.match.test(trimmed)) return intent.build();
  }

  const MIN_SCORE = 0.1;
  const hits = search(index, trimmed, 3).filter((hit) => hit.score >= MIN_SCORE);
  if (hits.length === 0) {
    return {
      text: "Nothing in the portfolio matches that. This answers only from what is written here — it has no other knowledge and will not guess.",
      sources: suggestedQuestions.slice(0, 3).map((s) => ({ label: s.question, href: "#" })),
      via: "none",
    };
  }

  return {
    text: hits[0].doc.snippet,
    bullets: hits.slice(1).map((hit) => `${hit.doc.title} — ${hit.doc.snippet}`),
    sources: hits.filter((hit) => hit.doc.href).map((hit) => ({ label: hit.doc.title, href: hit.doc.href! })),
    via: "retrieved",
    scored: hits,
  };
}
