/**
 * Identity, contact, and employment history.
 *
 * Every field here restates something already published elsewhere in this repo
 * (portfolio-data.ts, the résumé PDF, or prior homepage copy). Nothing is
 * inferred or estimated. If a number is not sourced, it does not belong here.
 */

export const profile = {
  name: "Moinuddin Shaik",
  shortName: "Moin",
  role: "AI Engineer · Applied Scientist",
  tagline: "Builds AI systems and the evaluation that proves they work.",
  location: { city: "Hyderabad", country: "India", coords: "17.3850° N, 78.4867° E" },
  email: "hello@moinuddin.app",
  education: {
    degree: "B.Tech, Computer Science (AI & ML)",
    grade: "9.09 / 10",
  },
  openTo: "Applied Scientist, ML Systems, and early-stage AI engineering roles",
  currently: "Building AI-native products and first-author research",
  focus: ["LLM systems", "Retrieval", "Evaluation", "ML infrastructure"],
  links: {
    github: "https://github.com/CodeWithMoin",
    linkedin: "https://linkedin.com/in/codewithmoin",
    resume: "/Moinuddin_Shaik_Resume.pdf",
    email: "mailto:hello@moinuddin.app",
  },
} as const;

export type Role = {
  id: string;
  company: string;
  org: string;
  title: string;
  period: string;
  location: string;
  /** What was broken before. */
  problem: string;
  /** What he personally built. */
  built: string;
  /** The technical decisions that mattered. */
  approach: string[];
  /** Measured outcomes only — each one traceable to portfolio-data.ts. */
  outcomes: { value: string; label: string }[];
  /** Slug of the case study that documents this in depth. */
  caseStudy?: string;
  photo?: { src: string; alt: string };
  /** Selection context, where it is a matter of record. */
  note?: string;
};

export const roles: Role[] = [
  {
    id: "amazon",
    company: "Amazon",
    org: "RBS Sciences",
    title: "Applied Scientist Intern",
    period: "Jan–Jun 2026",
    location: "Bengaluru",
    problem:
      "Creating a taxonomy for a new feedback domain took a seven-notebook workflow. Scientists picked examples, tuned prompts, ran clustering, and stitched a three-level hierarchy by hand — five to seven days of expert time per domain, with a scientist in every step.",
    built:
      "A self-calibrating knowledge-extraction and taxonomy-induction system, shipped as a production container for multi-domain, million-record workloads.",
    approach: [
      "Mine and validate a small, diverse in-domain example set, then run cached batch extraction at scale.",
      "Density-based L3 discovery over structured phrases; the LLM classifies those clusters into a disjoint hierarchy.",
      "Deterministic attribution computes every quality claim before the LLM renders it in plain language.",
    ],
    outcomes: [
      { value: "0.74", label: "taxonomy F1, against a 0.71 manual scientist baseline" },
      { value: "<18h", label: "autonomous run, down from a five-to-seven-day workflow" },
      { value: "23.8% → 0.7%", label: "missing Category and Aspect extractions" },
      { value: "2.7× / 53%", label: "faster extraction, lower inference cost" },
      { value: "12 teams", label: "adopted the explainable evaluation framework" },
    ],
    caseStudy: "amazon-applied-science",
    photo: {
      src: "/experience/amazon.jpg",
      alt: "Moinuddin Shaik at the Amazon office in Bengaluru, wearing a visitor badge, standing behind the lobby's I-heart-amazon lettering",
    },
    note: "1 of ~200 Applied Scientist interns across India. Selected via Amazon ML Summer School 2025 — 3,000 of 1.6 lakh applicants.",
  },
  {
    id: "intel",
    company: "Intel",
    org: "Unnati",
    title: "AI Intern",
    period: "May–Jul 2025",
    location: "Hyderabad",
    problem:
      "Real-time video enhancement had to run on low-resource devices with no dedicated GPU, where the usual answer is to accept worse output or a slower frame budget.",
    built: "An optimized real-time video enhancement pipeline targeted at CPU-only inference.",
    approach: [
      "Traded model capacity against perceptual quality rather than accepting the default architecture.",
      "Tuned for CPU inference as the target, not as a fallback path.",
    ],
    outcomes: [
      { value: "20%", label: "clearer output" },
      { value: "30%", label: "smaller model" },
      { value: "35%", label: "faster CPU inference, without a dedicated GPU" },
    ],
  },
];

/** Quotes from people he worked with. Both are on the record. */
export const testimonials: {
  quote: string;
  /** The fuller version, shown on the case study the work belongs to. */
  quoteFull: string;
  name: string;
  role: string;
  relation: string;
  href: string | null;
  /** The case study these quotes belong beside. */
  projectSlug: string;
}[] = [
  {
    quote:
      "He worked on using LLMs for taxonomy use cases, he is a remarkably quick learner who brings new ideas and executes them fast.",
    quoteFull:
      "I mentored Moin during his Amazon internship. He worked on using LLMs for taxonomy use cases, he is a remarkably quick learner who brings new ideas and executes them fast.",
    name: "Manan Soni",
    role: "Applied Scientist II at Amazon",
    relation: "Mentored Moin during the internship",
    href: null,
    projectSlug: "amazon-applied-science",
  },
  {
    quote:
      "His passion for solving complex problems stood out from day one. He took on a genuinely challenging project and delivered real impact, backing every decision with thoughtful, well-run experiments.",
    quoteFull:
      "I had the pleasure of working with Moin during his internship. His passion for solving complex problems stood out from day one. He took on a genuinely challenging project and delivered real impact, backing every decision with thoughtful, well-run experiments. Any team would be lucky to have someone with his curiosity, ownership, and drive to dive deep, invent, and simplify.",
    name: "Sachin Giroh",
    role: "Applied Scientist at Amazon",
    relation: "Worked with Moin on the same team at Amazon",
    href: "https://www.linkedin.com/in/sachin-giroh-154a57a5/",
    projectSlug: "amazon-applied-science",
  },
];

/** Life before AI. Kept because it is evidence of self-direction, not filler. */
export const priorLife = [
  {
    id: "video",
    headline: "200+ video clients, from age 15",
    detail:
      "Cinematic editing and motion graphics — Fiverr first, then direct, over roughly five years alongside school and college. 4.9 across 117 reviews. Nobody assigned it: he found the work, taught himself the craft, and delivered to a brief on a deadline for people who were paying.",
    stats: [
      { value: "4.9", label: "across 117 Fiverr reviews" },
      { value: "200+", label: "clients over roughly five years" },
      { value: "15", label: "age he started, on his sister's account" },
    ],
  },
  {
    id: "badminton",
    headline: "Student Nationals silver, doubles",
    detail:
      "Picked up badminton at 11, competed at state level, took a doubles silver at Student Nationals in 2018. Lockdown ended it — but it was the first time getting good at something was measured by someone other than him.",
    stats: [
      { value: "11", label: "age he started" },
      { value: "2018", label: "Nationals silver" },
      { value: "State", label: "level competed at" },
    ],
  },
];
