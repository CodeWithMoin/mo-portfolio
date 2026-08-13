import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProject, projects } from "@/lib/portfolio-data";

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
        <div>{children}</div>
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

  return (
    <main>
      <SiteHeader />
      <article className="mx-auto max-w-[1180px] px-5 pb-20 pt-32 sm:px-8 md:pt-40 lg:px-10">
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
            {project.slug === "amazon-applied-science" && (
              <>
                <span className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-5 text-sm text-muted">Public summary only</span>
                <span className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-5 text-sm text-muted">1 of ~200 interns across India · Amazon ML Summer School 2025</span>
              </>
            )}
            {project.slug === "decode" && (
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm text-muted">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                Currently building
              </span>
            )}
          </div>
        </Reveal>

        {project.slug === "amazon-applied-science" && (
          <Reveal className="mt-8">
            <blockquote className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
              <p className="text-pretty text-lg leading-8 text-foreground/85 sm:text-xl">
                "I mentored Moin during his Amazon internship. He worked on using LLMs for taxonomy use cases, he is a remarkably quick learner who brings new ideas and executes them fast."
              </p>
              <footer className="mt-4 text-[15px] text-muted">
                <span className="font-medium text-foreground/70">Manan Soni</span>, Applied Scientist II at Amazon · mentored Moin during the internship
              </footer>
            </blockquote>
          </Reveal>
        )}

        <Reveal className="mt-12">
          <ProjectVisual className="min-h-[430px] sm:min-h-[520px]" variant={project.visual} />
        </Reveal>

        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div className="bg-surface p-5 sm:p-6" key={metric.label}>
              <p className="text-3xl font-bold tracking-[-0.04em]">{metric.value}</p>
              <p className="mt-2 text-sm text-muted">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <CaseSection index="01" title="Problem">
            <p className="max-w-3xl text-xl leading-9 text-foreground/88 sm:text-2xl sm:leading-10">{project.problem}</p>
          </CaseSection>

          <CaseSection index="02" title="Why it matters">
            <p className="max-w-3xl text-lg leading-8 text-muted sm:text-xl sm:leading-9">{project.why}</p>
          </CaseSection>

          <CaseSection index="03" title="Architecture">
            <ArchitectureDiagram nodes={project.architecture} note={project.architectureNote} />
          </CaseSection>

          {project.slug === "doculens-ai" && (
            <CaseSection index="04" title="Product surface">
              <div className="space-y-5">
                <figure className="overflow-hidden rounded-[1.5rem] border border-border bg-surface p-2 shadow-card">
                  <Image
                    alt="DocuLens AI workspace showing document intelligence workflows"
                    className="h-auto w-full rounded-[1.1rem]"
                    height={1080}
                    priority={false}
                    sizes="(max-width: 768px) 100vw, 760px"
                    src="/work/doculens/workspace.jpg"
                    width={1920}
                  />
                </figure>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Image alt="DocuLens AI landing page" className="h-auto w-full rounded-[1.25rem] border border-border" height={1080} loading="lazy" sizes="(max-width: 768px) 100vw, 380px" src="/work/doculens/landing.jpg" width={1920} />
                  <Image alt="DocuLens AI evidence-first question answering studio" className="h-auto w-full rounded-[1.25rem] border border-border" height={1080} loading="lazy" sizes="(max-width: 768px) 100vw, 380px" src="/work/doculens/qa-studio.jpg" width={1920} />
                </div>
              </div>
            </CaseSection>
          )}

          <CaseSection index={project.slug === "doculens-ai" ? "05" : "04"} title="Technical challenges">
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

          <CaseSection index={project.slug === "doculens-ai" ? "06" : "05"} title="Tradeoffs">
            <div className="divide-y divide-border border-y border-border">
              {project.tradeoffs.map((tradeoff) => (
                <div className="grid gap-3 py-6 sm:grid-cols-[0.8fr_1.2fr]" key={tradeoff.decision}>
                  <h3 className="font-medium tracking-[-0.02em]">{tradeoff.decision}</h3>
                  <p className="text-sm leading-7 text-muted">{tradeoff.rationale}</p>
                </div>
              ))}
            </div>
          </CaseSection>

          <CaseSection index={project.slug === "doculens-ai" ? "07" : "06"} title="Experiments">
            <ol className="space-y-4">
              {project.experiments.map((experiment, index) => (
                <li className="flex gap-4 rounded-2xl border border-border bg-surface p-5 text-base leading-7 text-muted" key={experiment}>
                  <span className="text-[13px] font-semibold text-accent">0{index + 1}</span><span>{experiment}</span>
                </li>
              ))}
            </ol>
          </CaseSection>

          <CaseSection index={project.slug === "doculens-ai" ? "08" : "07"} title="Results">
            <div className="space-y-3">
              {project.results.map((result) => (
                <p className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 text-base leading-7" key={result}>{result}</p>
              ))}
            </div>
          </CaseSection>

          <CaseSection index={project.slug === "doculens-ai" ? "09" : "08"} title="Lessons learned">
            <ul className="space-y-4 text-lg leading-8 text-muted">
              {project.lessons.map((lesson) => <li className="border-l border-accent pl-5" key={lesson}>{lesson}</li>)}
            </ul>
          </CaseSection>

          <CaseSection index={project.slug === "doculens-ai" ? "10" : "09"} title="Future work">
            <ul className="space-y-3">
              {project.future.map((item) => <li className="flex gap-3 text-base leading-7 text-muted" key={item}><span className="text-accent" aria-hidden="true">→</span>{item}</li>)}
            </ul>
          </CaseSection>
        </div>

        <Reveal>
          <aside className="mt-20 rounded-[2rem] border border-border bg-surface p-7 sm:p-10 md:mt-28">
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
            <a className="transition hover:text-foreground" href="mailto:hello@moinuddin.app">Email</a>
            <a className="transition hover:text-foreground" href="https://github.com/CodeWithMoin" rel="noreferrer" target="_blank">GitHub</a>
            <a className="transition hover:text-foreground" href="/Moinuddin_Shaik_Resume.pdf" target="_blank">Résumé</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
