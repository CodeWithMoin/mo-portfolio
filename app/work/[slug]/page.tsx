import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pipeline, PipelineVisual } from "@/components/pipeline";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { getProject, projects } from "@/lib/portfolio-data";
import { profile, testimonials } from "@/lib/profile";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} · Case study`,
      description: project.summary,
      type: "article",
    },
  };
}

function CaseSection({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="grid gap-6 border-t border-border py-12 md:grid-cols-[0.34fr_0.66fr] md:py-16">
        <div>
          <span className="inline-flex rounded-full border border-border bg-white px-3 py-1 text-[13px] font-medium text-muted shadow-[0_1px_2px_rgba(13,13,12,0.05)]">{index}</span>
          <h2 className="mt-3 text-xl font-bold tracking-[-0.03em]">{title}</h2>
        </div>
        <div className="min-w-0">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  // One counter for the whole page: sections are numbered in render order, so a
  // conditionally rendered section cannot leave a gap or a duplicate behind it.
  const projectTestimonials = testimonials.filter((testimonial) => testimonial.projectSlug === project.slug);

  let caseIndex = 0;
  const nextIndex = () => String(++caseIndex).padStart(2, "0");

  return (
    <main className="overflow-x-clip">
      <SiteHeader />
      <article className="relative isolate mx-auto max-w-[1180px] px-5 pb-20 pt-32 sm:px-8 md:pt-40 lg:px-10">
        {/* Quieter than the homepage: here there is no card for the glow to sit behind. */}
        <div aria-hidden="true" className="atmosphere [--glow:6%]" />
        <Reveal>
          <Link className="inline-flex items-center gap-1.5 text-[15px] font-medium text-muted transition hover:text-foreground" href="/#work">
            <span aria-hidden="true">←</span> Selected work
          </Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.17fr_0.83fr] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium text-foreground/70 shadow-[0_1px_2px_rgba(13,13,12,0.05)]">{project.eyebrow} · {project.year}</span>
              <h1 className="mt-6 max-w-4xl text-balance text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.02] tracking-[-0.045em]">
                {project.title}
              </h1>
            </div>
            <p className="max-w-2xl text-pretty text-xl leading-8 text-muted sm:text-2xl sm:leading-9">{project.thesis}</p>
          </div>
          <p className="mt-6 text-[15px] font-medium text-foreground/70">{project.role}</p>
          <div className="mt-12 flex flex-wrap gap-3">
            {project.links.map((link, index) => (
              <Button href={link.href} key={link.href} variant={index === 0 ? "primary" : "secondary"}>{link.label} ↗</Button>
            ))}
            {project.badges?.map((badge) => (
              <span
                className="material inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm text-muted"
                key={badge.label}
              >
                {badge.live && (
                  <span aria-hidden="true" className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                )}
                {badge.label}
              </span>
            ))}
          </div>
        </Reveal>

        {projectTestimonials.length > 0 && (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {projectTestimonials.map((testimonial, index) => (
              <Reveal delay={index * 0.05} key={testimonial.name}>
                <blockquote className="h-full rounded-2xl material p-6 sm:p-8">
                  <p className="text-pretty text-lg leading-8 text-foreground/85 sm:text-xl">
                    &ldquo;{testimonial.quoteFull}&rdquo;
                  </p>
                  <footer className="mt-4 text-[15px] text-muted">
                    {testimonial.href ? (
                      <a className="font-medium text-foreground/70 transition hover:text-accent" href={testimonial.href} rel="noreferrer" target="_blank">
                        {testimonial.name}
                      </a>
                    ) : (
                      <span className="font-medium text-foreground/70">{testimonial.name}</span>
                    )}
                    , {testimonial.role} · {testimonial.relation}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-12">
          {project.visual ? (
            <ProjectVisual className="min-h-[430px] sm:min-h-[520px]" variant={project.visual} />
          ) : (
            <PipelineVisual className="min-h-[430px] sm:min-h-[520px]" nodes={project.architecture} />
          )}
        </Reveal>

        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-[var(--card-shadow)] sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div className="bg-gradient-to-b from-white to-surface p-5 sm:p-6" key={metric.label}>
              <p className="text-3xl font-bold tabular-nums tracking-[-0.04em]">{metric.value}</p>
              <p className="mt-2 text-sm text-muted">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <CaseSection index={nextIndex()} title="Problem">
            <p className="max-w-3xl text-xl leading-9 text-foreground/88 sm:text-2xl sm:leading-10">{project.problem}</p>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Why it matters">
            <p className="max-w-3xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">{project.why}</p>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Architecture">
            <Pipeline details={project.stageDetails} nodes={project.architecture} note={project.architectureNote} />
          </CaseSection>

          {project.screenshots && project.screenshots.length > 0 && (
            <CaseSection index={nextIndex()} title={project.screenshotsTitle ?? "Product surface"}>
              <div className="space-y-5">
                {project.screenshots.filter((shot) => shot.feature).map((shot) => (
                  <figure className="overflow-hidden rounded-[1.5rem] material p-2" key={shot.src}>
                    <Image alt={shot.alt} className="h-auto w-full rounded-[1.1rem]" height={1080} sizes="(max-width: 768px) 100vw, 760px" src={shot.src} width={1920} />
                  </figure>
                ))}
                <div className={cn("grid gap-5", project.screenshots.filter((shot) => !shot.feature).length > 1 && "sm:grid-cols-2")}>
                  {project.screenshots.filter((shot) => !shot.feature).map((shot) => (
                    <Image alt={shot.alt} className="h-auto w-full rounded-[1.25rem] border border-border sm:[&:last-child:nth-child(odd)]:col-span-2" height={1080} key={shot.src} loading="lazy" sizes="(max-width: 768px) 100vw, 380px" src={shot.src} width={1920} />
                  ))}
                </div>
              </div>
            </CaseSection>
          )}

          <CaseSection index={nextIndex()} title="Technical challenges">
            <div className="grid gap-4">
              {project.challenges.map((challenge, index) => (
                <Card className="grid gap-4 p-6 sm:grid-cols-[auto_1fr]" key={challenge.title}>
                  <span className="text-[13px] font-semibold text-accent">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.03em]">{challenge.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{challenge.detail}</p>
                  </div>
                </Card>
              ))}
            </div>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Tradeoffs">
            <div className="divide-y divide-border border-y border-border">
              {project.tradeoffs.map((tradeoff) => (
                <div className="grid gap-3 py-6 sm:grid-cols-[0.8fr_1.2fr]" key={tradeoff.decision}>
                  <h3 className="font-medium tracking-[-0.02em]">{tradeoff.decision}</h3>
                  <p className="text-sm leading-7 text-muted">{tradeoff.rationale}</p>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Experiments">
            <ol className="space-y-4">
              {project.experiments.map((experiment, index) => (
                <li className="material flex gap-4 rounded-2xl p-5 text-base leading-7 text-muted" key={experiment}>
                  <span className="text-[13px] font-semibold text-accent">0{index + 1}</span><span>{experiment}</span>
                </li>
              ))}
            </ol>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Results">
            <div className="space-y-3">
              {project.results.map((result) => (
                <p className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 text-base leading-7" key={result}>{result}</p>
              ))}
            </div>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Lessons learned">
            <ul className="space-y-4 text-lg leading-8 text-muted">
              {project.lessons.map((lesson) => <li className="border-l border-accent pl-5" key={lesson}>{lesson}</li>)}
            </ul>
          </CaseSection>

          <CaseSection index={nextIndex()} title="Future work">
            <ul className="space-y-3">
              {project.future.map((item) => <li className="flex gap-3 text-base leading-7 text-muted" key={item}><span className="text-accent" aria-hidden="true">→</span>{item}</li>)}
            </ul>
          </CaseSection>
        </div>

        <Reveal>
          <aside className="mt-20 rounded-[2rem] material p-7 sm:p-10 md:mt-28">
            <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium text-foreground/70 shadow-[0_1px_2px_rgba(13,13,12,0.05)]">Next case study</span>
            <div className="mt-7 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="text-sm text-accent">{nextProject.eyebrow}</p>
                <h2 className="mt-3 text-4xl font-medium tracking-[-0.02em] sm:text-5xl">{nextProject.title}</h2>
              </div>
              <Button href={`/work/${nextProject.slug}`}>Read next <span aria-hidden="true">→</span></Button>
            </div>
          </aside>
        </Reveal>
      </article>

      <footer className="border-t border-border px-5 py-7 text-sm text-muted sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
          <p>© 2026 Moinuddin Shaik</p>
          <div className="flex gap-5">
            <a className="transition hover:text-foreground" href={profile.links.email}>Email</a>
            <a className="transition hover:text-foreground" href={profile.links.github} rel="noreferrer" target="_blank">GitHub</a>
            <a className="transition hover:text-foreground" href={profile.links.resume} target="_blank">Résumé</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
