/**
 * The site runs in one of two modes. This is the single source of truth for what
 * each mode is called, which sections it shows, and in what order.
 */
export type Audience = "recruiter" | "founder";

export const AUDIENCES: Audience[] = ["recruiter", "founder"];

/** Recruiters are the majority visitor, so they get the server-rendered default. */
export const DEFAULT_AUDIENCE: Audience = "recruiter";

export const STORAGE_KEY = "portfolio-audience";

/** `?v=founder` makes a targeted link shareable; it wins over the stored preference. */
export const QUERY_KEY = "v";

/** This mode was shipped as "startup" first; old links and stored values still work. */
const ALIASES: Record<string, Audience> = { startup: "founder" };

export function normalizeAudience(value: unknown): Audience | null {
  if (value === "recruiter" || value === "founder") return value;
  if (typeof value === "string" && value in ALIASES) return ALIASES[value];
  return null;
}

export const audienceLabels: Record<Audience, { label: string; hint: string; verb: string }> = {
  recruiter: {
    label: "Recruiter",
    hint: "Evidence, experience, and how to reach me",
    verb: "Evaluating a candidate",
  },
  founder: {
    label: "Founder",
    hint: "What I ship, how fast, and how far I take it alone",
    verb: "Looking for a technical builder",
  },
};

export const sectionLabels: Record<string, string> = {
  work: "Work",
  results: "Results",
  build: "What I build",
  testimonials: "References",
  experience: "Experience",
  research: "Research",
  lab: "Lab",
  "open-source": "Open source",
  background: "Before AI",
  pattern: "The pattern",
  before: "Before AI",
  badminton: "Badminton",
};

/**
 * Section order per audience. Sections not listed are hidden for that audience.
 * Consumed as CSS `order` — every section stays in the DOM and in the crawled
 * HTML regardless of which audience is active.
 */
export const sectionOrder: Record<Audience, string[]> = {
  // No "open-source": every repository there is a project already shown under Work.
  recruiter: ["work", "results", "experience", "testimonials", "build", "research", "lab", "background"],
  // Evidence first, backstory last. The previous order ran pattern → before →
  // badminton back to back, putting three sections of pre-AI history between the
  // lab and the code. The arc is a good closer, not a second act.
  founder: ["work", "build", "lab", "results", "testimonials", "open-source", "experience", "research", "pattern", "before", "badminton"],
};

/**
 * The handful of sections that earn a slot in the desktop header. Ten inline links
 * would overflow the bar, so this is curated per audience rather than sliced off
 * sectionOrder. Every id here must also appear in that audience's sectionOrder.
 * The mobile menu still lists every section.
 */
export const primaryNav: Record<Audience, string[]> = {
  recruiter: ["work", "results", "experience", "research"],
  founder: ["work", "build", "lab", "before"],
};
