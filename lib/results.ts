/**
 * Results that have a genuine baseline — the thing being replaced, measured the same
 * way. A number without a comparison is a claim; with one it is a result, which is
 * the difference this table exists to show.
 *
 * Every value restates a figure already published in that project's case study
 * (lib/portfolio-data.ts). Rows with no real baseline are deliberately left out
 * rather than padded with a target or an implied one.
 */
export type Result = {
  /** Case study that documents the method. */
  slug: string;
  system: string;
  metric: string;
  baseline: string;
  baselineNote?: string;
  result: string;
  /** Which direction is an improvement, so the arrow can be honest about it. */
  better: "higher" | "lower";
  note?: string;
};

export const results: Result[] = [
  {
    slug: "amazon-applied-science",
    system: "Taxonomy induction · Amazon",
    metric: "Taxonomy F1",
    baseline: "0.71",
    baselineNote: "manual, by scientists",
    result: "0.74",
    better: "higher",
  },
  {
    slug: "amazon-applied-science",
    system: "Knowledge extraction · Amazon",
    metric: "Missing Category / Aspect extractions",
    baseline: "23.8%",
    result: "0.7%",
    better: "lower",
  },
  {
    slug: "amazon-applied-science",
    system: "Domain onboarding · Amazon",
    metric: "Time to a new taxonomy",
    baseline: "5–7 days",
    baselineNote: "seven-notebook workflow",
    result: "<18 h",
    better: "lower",
    note: "autonomous run",
  },
  {
    slug: "taxonomy-evaluation-research",
    system: "LUMEN · 5,000 labels",
    metric: "Classification F1",
    baseline: "89.4",
    baselineNote: "Sonnet 4.5",
    result: "89.6",
    better: "higher",
    note: "at ~99% lower inference cost",
  },
  {
    slug: "markalign",
    system: "MarkAlign · ASAP essays",
    metric: "QWK against the teacher",
    baseline: "0.585",
    baselineNote: "direct rating, same model",
    result: "0.664",
    better: "higher",
    note: "92% of the 0.72 human-vs-human ceiling",
  },
  {
    slug: "attest",
    system: "Attest · agentic RAG",
    metric: "Failing citations",
    baseline: "9.87%",
    baselineNote: "before verification",
    result: "4.15%",
    better: "lower",
  },
];
