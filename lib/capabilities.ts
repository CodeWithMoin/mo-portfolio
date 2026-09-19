import { projects, type Project } from "@/lib/portfolio-data";

/**
 * What he builds, grouped by the kind of problem rather than by technology.
 *
 * A capability only exists here if shipped projects back it, and the projects are
 * referenced by slug so the claim and the evidence cannot drift apart. Projects
 * appear under more than one heading on purpose — that overlap is the point.
 */
export type Capability = {
  id: string;
  title: string;
  blurb: string;
  slugs: string[];
};

export const capabilities: Capability[] = [
  {
    id: "ai-products",
    title: "AI products",
    blurb: "Whole systems someone can actually use, not a notebook with a demo cell.",
    slugs: ["doculens-ai", "decode", "ecoguardian-ai"],
  },
  {
    id: "evaluation",
    title: "Evaluation",
    blurb: "Deciding whether a model works, and whether it worked for the right reason.",
    slugs: ["markalign", "attest", "taxonomy-evaluation-research"],
  },
  {
    id: "applied-ml",
    title: "Applied ML",
    blurb: "Models trained and tuned against a real constraint — latency, cost, or a device with no GPU.",
    slugs: ["smart-turn", "amazon-applied-science", "ecoguardian-ai"],
  },
  {
    id: "backends",
    title: "Production backends",
    blurb: "Durable execution, typed contracts, and the failure paths that decide what users lose.",
    slugs: ["trellis", "doculens-ai", "decode"],
  },
];

/**
 * Resolves a capability's slugs to projects. Throws on a slug that no longer
 * exists so a renamed project fails the build instead of silently emptying a card.
 */
export function projectsFor(capability: Capability): Project[] {
  return capability.slugs.map((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug);
    if (!project) throw new Error(`Capability "${capability.id}" references unknown project "${slug}"`);
    return project;
  });
}
