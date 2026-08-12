import Link from "next/link";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { interests, projects, publications, repositories } from "@/lib/portfolio-data";

const experience = [
  {
    company: "Amazon · RBS Sciences",
    role: "Applied Scientist Intern",
    period: "Jan–Jun 2026",
    location: "Bengaluru",
    impact:
      "Owned a self-calibrating knowledge-extraction system from problem framing to production, then expanded into autonomous taxonomy generation and grounded metric explainability. Cut onboarding from five to seven days to under 18 hours, reached 0.74 F1 against a 0.71 manual baseline, and accelerated extraction 2.7× at 53% lower cost.",
  },
  {
    company: "Intel · Unnati",
    role: "AI Intern",
    period: "May–Jul 2025",
    location: "Hyderabad",
    impact:
      "Optimized real-time video enhancement for low-resource devices: 20% clearer output, a 30% smaller model, and 35% faster CPU inference without a dedicated GPU.",
  },
];

const writing = [
  {
    title: "Citation-first RAG is an interface decision",
    summary: "Why provenance has to survive ingestion, retrieval, generation, and the final interaction—not live in a hidden log.",
    tag: "Retrieval systems",
  },
  {
    title: "What flat F1 misses in hierarchical systems",
    summary: "A field note on duplicated concepts, boundary ambiguity, and evaluation that respects structure.",
    tag: "LLM evaluation",
  },
  {
    title: "A useful public AI demo does not need public model spend",
    summary: "Designing a read-only product tour that shows complete workflows without accepting data or invoking a model.",
    tag: "Product engineering",
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 grid gap-4 border-t border-border pt-6 md:mb-14 md:grid-cols-[0.45fr_1.55fr]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{eyebrow}</p>
      <div>
        <h2 className="max-w-3xl text-balance text-3xl font-medium tracking-[-0.045em] sm:text-5xl">{title}</h2>
        {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />

      <section className="relative mx-auto flex min-h-[92svh] max-w-[1180px] flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-20 lg:px-10">
        <div className="hero-glow" aria-hidden="true" />
        <Reveal>
          <div className="relative z-10">
            <p className="mb-7 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_14px_var(--accent)]" />
              Applied Scientist · AI Systems Engineer
            </p>
            <h1 className="max-w-[1080px] text-balance text-[clamp(3.7rem,10vw,8.8rem)] font-medium leading-[0.88] tracking-[-0.075em]">
              Moinuddin Shaik
            </h1>
            <p className="mt-5 max-w-5xl text-balance text-[clamp(2.25rem,6vw,6rem)] font-medium leading-[0.95] tracking-[-0.065em] text-muted-strong">
              Building reliable <span className="text-foreground">AI systems.</span>
            </p>
            <div className="mt-9 grid gap-7 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <p className="max-w-2xl text-pretty text-lg leading-8 text-muted sm:text-xl sm:leading-9">
                I design retrieval, extraction, evaluation, and ML infrastructure that turn messy data into decisions people can inspect and trust.
              </p>
              <p className="font-mono text-[11px] uppercase leading-6 tracking-[0.14em] text-muted md:text-right">
                Hyderabad, India<br />Open to applied science + AI systems roles
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="#work">View projects <span aria-hidden="true">↓</span></Button>
              <Button href="#resume" variant="secondary">Résumé</Button>
              <Button href="https://github.com/CodeWithMoin" variant="ghost">GitHub ↗</Button>
              <Button href="https://linkedin.com/in/codewithmoin" variant="ghost">LinkedIn ↗</Button>
            </div>
          </div>
        </Reveal>
        <div className="relative z-10 mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {[
            ["0.74 F1", "Automated taxonomy generation"],
            ["10K+ docs", "Citation-first retrieval"],
            ["<300ms", "Offline mobile inference"],
          ].map(([value, label]) => (
            <div className="bg-background/85 px-5 py-4 backdrop-blur" key={label}>
              <p className="text-lg font-medium tracking-[-0.03em]">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="work">
        <Reveal>
          <SectionHeading
            eyebrow="01 · Selected work"
            title="Systems where correctness has to survive contact with reality."
            description="Six case studies spanning grounded agents, durable multi-agent workflows, production LLM systems, taxonomy research, retrieval infrastructure, and on-device ML. Each one starts with the operating constraint—not the model name."
          />
        </Reveal>
        <div className="space-y-7">
          {projects.map((project, index) => (
            <Reveal delay={Math.min(index * 0.04, 0.12)} key={project.slug}>
              <Card className="group overflow-hidden p-2 transition duration-300 hover:border-foreground/20 sm:p-3">
                <div className="grid gap-2 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="flex min-h-[390px] flex-col justify-between rounded-[1.15rem] bg-surface-raised p-6 sm:p-8">
                    <div>
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                        <span>{project.index} · {project.eyebrow}</span>
                        <span>{project.year}</span>
                      </div>
                      <Link href={`/work/${project.slug}`}>
                        <h3 className="mt-9 max-w-lg text-balance text-4xl font-medium tracking-[-0.055em] transition group-hover:text-accent sm:text-5xl">
                          {project.title}
                        </h3>
                      </Link>
                      <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{project.summary}</p>
                    </div>
                    <div>
                      <div className="grid grid-cols-3 gap-3 border-t border-border pt-5">
                        {project.metrics.map((metric) => (
                          <div key={metric.label}>
                            <p className="text-lg font-medium tracking-[-0.03em] sm:text-xl">{metric.value}</p>
                            <p className="mt-1 text-[11px] leading-4 text-muted">{metric.label}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                        <Link className="text-sm font-medium text-foreground transition hover:text-accent" href={`/work/${project.slug}`}>
                          Read case study <span aria-hidden="true">↗</span>
                        </Link>
                        {project.links.slice(0, 2).map((link) => (
                          <a className="text-sm text-muted transition hover:text-foreground" href={link.href} key={link.href} rel="noreferrer" target="_blank">
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ProjectVisual className="min-h-[420px] lg:min-h-full" variant={project.visual} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="research">
        <Reveal>
          <SectionHeading
            eyebrow="02 · Publications"
            title="Research that makes model behavior easier to measure."
            description="Current work focuses on hierarchy quality, classification at large label scales, and the cost of reliable decisions. Submission status is stated plainly."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {publications.map((publication, index) => (
            <Reveal delay={index * 0.05} key={publication.title}>
              <Card className="research-card group flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:border-foreground/20 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
                  <span className="flex items-center gap-3"><span className="text-accent">0{index + 1}</span>{publication.venue}</span>
                  <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-3 py-1 text-accent">{publication.status}</span>
                </div>
                <div className="mt-7 h-px bg-border" />
                <h3 className="mt-8 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.045em] transition group-hover:text-accent sm:text-4xl">{publication.title}</h3>
                <p className="mt-3 text-sm font-medium text-foreground/70">{publication.role}</p>
                <div className="mt-9 flex-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">Abstract</p>
                  <p className="mt-3 text-base leading-8 text-muted">{publication.abstract}</p>
                </div>
                <div className="mt-8 border-t border-border pt-5">
                  <a className="text-sm font-medium transition hover:text-accent" href={`mailto:moinuddinmoin1357@gmail.com?subject=${encodeURIComponent(`Preprint request: ${publication.title}`)}`}>
                    Request manuscript <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="experience">
        <Reveal>
          <SectionHeading eyebrow="03 · Experience" title="A short record of outcomes, not job descriptions." />
        </Reveal>
        <div className="border-t border-border">
          {experience.map((item, index) => (
            <Reveal key={item.company}>
              <article className="grid gap-5 border-b border-border py-8 md:grid-cols-[0.38fr_0.62fr] md:py-11">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">0{index + 1} · {item.period}</p>
                  <p className="mt-2 text-sm text-muted">{item.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent">{item.company}</p>
                  <h3 className="mt-3 text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{item.role}</h3>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted sm:text-lg">{item.impact}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="04 · Technical interests"
            title="The questions I keep returning to."
            description="These are not keyword buckets. They are the parts of AI systems where I like to make ambiguity explicit and performance measurable."
          />
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest, index) => (
            <div className="min-h-52 bg-background p-6 transition hover:bg-surface sm:p-7" key={interest.title}>
              <p className="font-mono text-[10px] text-muted">0{index + 1}</p>
              <h3 className="mt-9 text-xl font-medium tracking-[-0.035em]">{interest.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{interest.detail}</p>
            </div>
          ))}
          <div className="relative min-h-52 overflow-hidden bg-surface-raised p-6 text-foreground sm:p-7 lg:col-span-2 lg:grid lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative">
              <p className="font-mono text-[10px] text-accent">NOW</p>
              <h3 className="mt-9 text-xl font-medium tracking-[-0.035em]">Evaluation-aware products</h3>
            </div>
            <p className="relative mt-3 max-w-lg text-sm leading-6 text-muted lg:mt-0">Building evaluation into the workflow so quality changes the product, not just a dashboard.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="writing">
        <Reveal>
          <SectionHeading
            eyebrow="05 · Field notes"
            title="Writing in the open, with the same standard as the code."
            description="A future home for technical notes drawn from systems I have actually built and evaluated. No trend summaries; only concrete decisions and evidence."
          />
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {writing.map((article, index) => (
            <Reveal delay={index * 0.04} key={article.title}>
              <Card className="group flex h-full flex-col p-6 transition duration-300 hover:border-foreground/20 hover:bg-surface-raised sm:p-7">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span className="text-accent">0{index + 1}</span><span>{article.tag}</span>
                </div>
                <div className="mt-5 h-px bg-border" />
                <h3 className="mt-10 text-2xl font-medium leading-tight tracking-[-0.04em] transition group-hover:text-accent">{article.title}</h3>
                <p className="mt-5 flex-1 text-sm leading-7 text-muted">{article.summary}</p>
                <p className="mt-10 font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Draft · In progress</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="open-source">
        <Reveal>
          <SectionHeading
            eyebrow="06 · Open source"
            title="The implementation is part of the argument."
            description="Public repositories include product code, typed APIs, tests, CI, deployment notes, and explicit limitations—not only screenshots."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <Card className="overflow-hidden p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">GitHub snapshot · Jul 2026</p>
            <p className="mt-9 text-7xl font-medium tracking-[-0.07em]">13</p>
            <p className="mt-2 text-base text-muted">public repositories</p>
            <div className="mt-10 space-y-4 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted">Public pushes · 7 days</span><span>7 across 2 repos</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Latest focus</span><span>DocuLens AI</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Primary languages</span><span>Python · TypeScript</span></div>
              <div className="flex items-center justify-between"><span className="text-muted">Public licenses</span><span>MIT · Apache 2.0</span></div>
            </div>
            <a className="mt-8 inline-flex text-sm font-medium transition hover:text-accent" href="https://github.com/CodeWithMoin" rel="noreferrer" target="_blank">
              View GitHub profile ↗
            </a>
          </Card>
          <div className="space-y-3">
            {repositories.map((repository) => (
              <a className="group block" href={repository.href} key={repository.name} rel="noreferrer" target="_blank">
                <Card className="grid gap-5 p-6 transition hover:border-foreground/20 hover:bg-surface-raised sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.03em] transition group-hover:text-accent">{repository.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{repository.description}</p>
                  </div>
                  <div className="flex gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">
                    <span className="rounded-full border border-border px-3 py-1.5">{repository.language}</span>
                    <span className="rounded-full border border-border px-3 py-1.5">{repository.license}</span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="resume">
        <Reveal>
          <SectionHeading
            eyebrow="07 · Résumé"
            title="The concise version, embedded."
            description="One page covering experience, education, selected systems, research, and technical foundations."
          />
        </Reveal>
        <Card className="overflow-hidden p-2 sm:p-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-[1.1rem] border-b border-border bg-surface-raised px-4 py-3 sm:px-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">Moinuddin Shaik · Résumé · PDF</p>
            <a className="text-sm font-medium transition hover:text-accent" href="/Moinuddin_Shaik_Resume.pdf" target="_blank">Open full screen ↗</a>
          </div>
          <object
            aria-label="Embedded résumé for Moinuddin Shaik"
            className="h-[72svh] min-h-[600px] w-full rounded-b-[1.1rem] bg-white"
            data="/Moinuddin_Shaik_Resume.pdf#view=FitH&toolbar=0"
            type="application/pdf"
          >
            <div className="grid min-h-[420px] place-items-center p-8 text-center">
              <p className="max-w-md text-muted">Your browser cannot display the embedded résumé. <a className="text-foreground underline" href="/Moinuddin_Shaik_Resume.pdf">Open the PDF instead.</a></p>
            </div>
          </object>
        </Card>
      </section>

      <footer className="mx-auto max-w-[1180px] px-5 pb-8 pt-20 sm:px-8 md:pt-28 lg:px-10">
        <div className="rounded-[2rem] border border-border bg-surface p-7 sm:p-10 lg:p-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Let’s build something that has to work</p>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <h2 className="max-w-4xl text-balance text-4xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Hard problem. Clear evidence. Reliable system.
            </h2>
            <div className="lg:text-right">
              <a className="text-lg font-medium transition hover:text-accent" href="mailto:moinuddinmoin1357@gmail.com">moinuddinmoin1357@gmail.com ↗</a>
              <p className="mt-3 text-sm leading-6 text-muted">Available for applied science, ML systems, and early-stage AI product teams.</p>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6 text-sm text-muted">
            <p>© 2026 Moinuddin Shaik</p>
            <div className="flex flex-wrap gap-5">
              <a className="transition hover:text-foreground" href="mailto:moinuddinmoin1357@gmail.com">Email</a>
              <a className="transition hover:text-foreground" href="https://github.com/CodeWithMoin" rel="noreferrer" target="_blank">GitHub</a>
              <a className="transition hover:text-foreground" href="https://linkedin.com/in/codewithmoin" rel="noreferrer" target="_blank">LinkedIn</a>
              <a className="transition hover:text-foreground" href="/Moinuddin_Shaik_Resume.pdf" target="_blank">Résumé</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
