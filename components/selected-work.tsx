"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAudience } from "@/components/audience-provider";
import { ProjectThumbnail } from "@/components/project-thumbnail";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import type { Audience } from "@/lib/audience";
import { cn } from "@/lib/cn";
import { projects, type Project } from "@/lib/portfolio-data";

/**
 * Selected work, framed for whoever is reading.
 *
 * The two modes surface different projects and lead with a different sentence from
 * the same record: recruiters get `summary` (what it is), founders get `thesis`
 * (the opinionated call behind it). No copy is written twice — both fields already
 * exist on every project, and neither is invented for the occasion.
 */
const framing: Record<Audience, { slugs: string[]; lead: (project: Project) => string; heading: string; description: string }> = {
  recruiter: {
    slugs: ["amazon-applied-science", "markalign", "taxonomy-evaluation-research", "doculens-ai"],
    lead: (project) => project.summary,
    heading: "Systems where correctness had to survive contact with reality.",
    description:
      "Production LLM work at Amazon, a grading-alignment eval against the human ceiling, first-author taxonomy research, and citation-first retrieval. Each one states its constraint before its stack.",
  },
  founder: {
    slugs: ["decode", "doculens-ai", "trellis", "markalign"],
    lead: (project) => project.thesis,
    heading: "Built end to end, mostly alone.",
    description:
      "A multi-agent video system, a citation-first document product, a durable order lifecycle, and an eval harness with a live demo. Product call, architecture, models, backend, and interface — all mine each time.",
  },
};

/**
 * The picture on a compact card. A real screenshot or figure when the project has
 * one — cross-fading to a second view on hover — and otherwise the first stages of
 * its actual pipeline, drawn from data, so no card is a bare block of text and none
 * shows an invented UI.
 */
function CardMedia({ project }: { project: Project }) {
  const frame = "relative aspect-[16/10] overflow-hidden rounded-[1.15rem] border border-border";

  if (project.thumbnail) {
    const { src, alt, hoverSrc } = project.thumbnail;
    const position = project.thumbnail.position === "center" ? "object-center" : "object-top";
    return (
      <div className={cn(frame, "bg-white")}>
        <Image alt={alt} className={cn("card-media object-cover", position)} fill loading="lazy" sizes="(max-width: 768px) 100vw, 380px" src={src} />
        {hoverSrc && <Image alt="" aria-hidden="true" className={cn("card-media card-media-alt object-cover", position)} fill loading="lazy" sizes="(max-width: 768px) 100vw, 380px" src={hoverSrc} />}
      </div>
    );
  }

  const stages = project.architecture.slice(0, 4);
  return (
    <div aria-hidden="true" className={cn(frame, "well product-grid flex flex-col justify-center gap-1.5 px-4")}>
      {stages.map((stage, index) => (
        <div className="flex items-center gap-2.5" key={stage}>
          <span className="w-4 shrink-0 font-mono text-[9px] text-muted">{String(index + 1).padStart(2, "0")}</span>
          <span className="min-w-0 flex-1 truncate rounded-md border border-border bg-white/90 px-2.5 py-1.5 text-[11px] font-medium shadow-[0_1px_1px_rgba(13,13,12,0.03)]">{stage}</span>
        </div>
      ))}
      {project.architecture.length > stages.length && (
        <p className="pl-[1.65rem] font-mono text-[9px] text-muted">+{project.architecture.length - stages.length} more stages</p>
      )}
    </div>
  );
}

export function SelectedWork() {
  const { audience } = useAudience();
  const mode = framing[audience];

  const featured = mode.slugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));

  const [lead, ...supporting] = featured;
  const rest = projects.filter((project) => !mode.slugs.includes(project.slug));

  return (
    <>
      <SectionHeading description={mode.description} eyebrow="Selected work" title={mode.heading} />

      {/* One lead project at full size, then three compact ones. Four full-size
          cards ran 2,700px — most of a recruiter's scroll budget on one section. */}
      {lead && (
        <motion.div key={lead.slug} layout transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <Card className="lift group overflow-hidden p-2 sm:p-3">
            <div className="grid gap-2 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="flex flex-col justify-between well rounded-[1.15rem] p-6 sm:min-h-[400px] sm:p-8">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{lead.eyebrow}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{lead.year}</span>
                  </div>
                  <Link href={`/work/${lead.slug}`}>
                    <h3 className="mt-7 max-w-lg text-balance text-4xl font-bold tracking-[-0.04em] transition group-hover:text-accent sm:text-[2.5rem] sm:leading-[1.08]">
                      {lead.title}
                    </h3>
                  </Link>
                  <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-[17px] sm:leading-8">{mode.lead(lead)}</p>
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-3 border-t border-border pt-5">
                    {lead.metrics.map((metric) => (
                      <div key={metric.label}>
                        <p className="text-lg font-semibold tabular-nums tracking-[-0.03em] sm:text-xl">{metric.value}</p>
                        <p className="mt-1 text-[11px] leading-4 text-muted">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <Link className="text-sm font-medium text-foreground transition hover:text-accent" href={`/work/${lead.slug}`}>
                      Read case study <span aria-hidden="true" className="nudge">↗</span>
                    </Link>
                    {lead.links.slice(0, 2).map((link) => (
                      <a className="text-sm text-muted transition hover:text-foreground" href={link.href} key={link.href} rel="noreferrer" target="_blank">
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <ProjectThumbnail className="hidden min-h-[420px] lg:block lg:min-h-full" project={lead} />
            </div>
          </Card>
        </motion.div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {supporting.map((project) => (
          <motion.div className="h-full" key={project.slug} layout transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <Link className="group block h-full" href={`/work/${project.slug}`}>
              <Card className="lift flex h-full flex-col p-3 sm:p-3.5">
                <CardMedia project={project} />
                <div className="flex flex-1 flex-col px-3 pb-3 pt-5 sm:px-3.5 sm:pb-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{project.eyebrow}</span>
                  <span className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">{project.year}</span>
                </div>
                <h3 className="mt-4 text-balance text-2xl font-bold tracking-[-0.035em] transition group-hover:text-accent">{project.title}</h3>
                {/* The clamp lives on an inner element: on the flex child itself, the stretch
                    let a sliver of the clamped line show through. */}
                <div className="mt-3 flex-1">
                  <p className="line-clamp-4 text-[15px] leading-6 text-muted">{mode.lead(project)}</p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <p className="text-base font-semibold tabular-nums tracking-[-0.03em]">{metric.value}</p>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-muted">{metric.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-sm font-medium">
                  Read case study <span aria-hidden="true" className="nudge">↗</span>
                </p>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" layout>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Also written up</p>
        {rest.map((project) => (
          <Link className="text-[15px] font-medium transition hover:text-accent" href={`/work/${project.slug}`} key={project.slug}>
            {project.title} <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </motion.div>
    </>
  );
}
