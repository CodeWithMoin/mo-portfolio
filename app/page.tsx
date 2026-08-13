import Image from "next/image";
import Link from "next/link";
import { ProjectVisual } from "@/components/project-visual";
import { Reveal } from "@/components/reveal";
import { ReviewStack } from "@/components/review-stack";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
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

const featuredSlugs = ["amazon-applied-science", "decode", "doculens-ai", "taxonomy-evaluation-research"];

const featuredProjects = featuredSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

const reviewCards = [
  { src: "/review-1.png", alt: "Fiverr review, five stars, United States: a client names Moinuddin and cites audio editing and 3D motion graphics" },
  { src: "/review-2.png", alt: "Fiverr review, five stars, United States: praises creative solutions and a 24-hour turnaround other editors declined" },
  { src: "/review-3.png", alt: "Fiverr review, five stars, Australia: repeat client says they will use the service again" },
  { src: "/review-4.png", alt: "Fiverr review, five stars, United Kingdom: calls the seller a consummate professional" },
  { src: "/review-5.png", alt: "Fiverr review, five stars, Mexico: praises excellent work and punctual delivery" },
  { src: "/review-6.png", alt: "Fiverr review, 4.3 stars, United States: notes talent and resourcefulness alongside criticism of communication" },
];

const receipts = [
  { value: "First author", label: "Universal Anecdote Miner · AMLC 2026, submitted", href: "#research" },
  { value: "200+", label: "Video clients — Fiverr, then direct, from age 15", href: "#before" },
  { value: "Silver", label: "Student Nationals · doubles", href: "#badminton" },
];

const milestones = [
  {
    age: "11",
    domain: "Badminton",
    detail: "State-level competition. Student Nationals silver in doubles, 2018. Stopped during lockdown.",
  },
  {
    age: "14",
    domain: "Code",
    detail: "Started in 10th class, 2020.",
  },
  {
    age: "15",
    domain: "Video",
    detail: "Editing for clients on Fiverr, then direct. 200+ clients over roughly five years.",
  },
  {
    age: "20",
    domain: "Amazon",
    detail: "Applied Scientist Intern. Production LLM systems over millions of feedback records.",
  },
  {
    age: "Now",
    domain: "Now",
    detail: "B.Tech CS (AI & ML), 9.09/10. Building AI systems, products, and research.",
  },
];

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex self-start rounded-full border border-border bg-white px-4 py-2 text-[15px] font-medium tracking-[-0.01em] text-foreground shadow-[0_1px_2px_rgba(13,13,12,0.05),0_4px_12px_rgba(13,13,12,0.04)]">
      {children}
    </span>
  );
}

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
    <div className="mb-10 flex flex-col md:mb-14">
      <CardLabel>{eyebrow}</CardLabel>
      <h2 className="mt-6 max-w-3xl text-balance text-3xl font-bold tracking-[-0.04em] sm:text-[2.9rem] sm:leading-[1.1]">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden">
      <SiteHeader />

      <section className="relative mx-auto max-w-[1180px] px-5 pb-8 pt-36 sm:px-8 sm:pt-44 lg:px-10">
        <Reveal>
          <p className="text-[15px] font-medium tracking-[-0.01em] text-muted">Moinuddin Shaik</p>
          <h1 className="mt-6 max-w-[19ch] text-balance text-[clamp(2.7rem,7vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.05em]">
            I build AI systems. Most recently at <span className="text-accent">Amazon</span>.
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-xl leading-8 text-muted sm:text-2xl sm:leading-9">
            Before that, video work for <span className="font-medium text-foreground">200+ clients</span>. I was 15 when
            I started.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-16 grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {receipts.map((receipt, index) => (
              <a
                className={cn("group block py-7 transition", index === 0 ? "sm:pr-8" : "sm:px-8", index === receipts.length - 1 && "sm:pr-0")}
                href={receipt.href}
                key={receipt.value}
              >
                <dt className="text-[2.1rem] font-bold leading-none tracking-[-0.045em] transition group-hover:text-accent sm:text-[2.6rem]">
                  {receipt.value}
                </dt>
                <dd className="mt-3 max-w-[28ch] text-[15px] leading-6 text-muted">{receipt.label}</dd>
              </a>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button className="h-14 px-8 text-base" href="#work">See the work</Button>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-4 py-2.5 text-[15px] font-medium tracking-[-0.01em]">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-status opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-status" />
              </span>
              Open to work
            </span>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="pattern">
        <Reveal>
          <SectionHeading
            eyebrow="The pattern"
            title="Start early. Go deep. Repeat."
            description="Different domains, different kinds of proof: competitive, commercial, published."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="hidden lg:block">
            <div className="grid grid-cols-5">
              {milestones.map((milestone) => (
                <p className="text-[3.5rem] font-bold leading-none tracking-[-0.05em]" key={milestone.age}>
                  {milestone.age}
                </p>
              ))}
            </div>
            <div className="relative mt-8">
              <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              <div className="relative grid grid-cols-5">
                {milestones.map((milestone, index) => (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-3 rounded-full ring-4 ring-background",
                      index === milestones.length - 1 ? "bg-accent" : "bg-foreground",
                    )}
                    key={milestone.age}
                  />
                ))}
              </div>
            </div>
            <div className="mt-8 grid grid-cols-5">
              {milestones.map((milestone) => (
                <div className="pr-8" key={milestone.age}>
                  <p className="text-lg font-semibold tracking-[-0.025em]">{milestone.domain}</p>
                  <p className="mt-2 text-[15px] leading-6 text-muted">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:hidden">
            <span aria-hidden="true" className="absolute left-[7px] top-2 h-[calc(100%-1.5rem)] w-px bg-border" />
            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <div className="relative pl-10" key={milestone.age}>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-2 size-3.5 rounded-full ring-4 ring-background",
                      index === milestones.length - 1 ? "bg-accent" : "bg-foreground",
                    )}
                  />
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold leading-none tracking-[-0.045em]">{milestone.age}</p>
                    <p className="text-lg font-semibold tracking-[-0.025em]">{milestone.domain}</p>
                  </div>
                  <p className="mt-3 text-[15px] leading-6 text-muted">{milestone.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="work">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Systems where correctness has to survive contact with reality."
            description="Four in depth: production LLM systems at Amazon, first-author taxonomy research, citation-first retrieval, and a durable multi-agent workflow. Each one starts with the operating constraint—not the model name."
          />
        </Reveal>
        <div className="space-y-7">
          {featuredProjects.map((project, index) => (
            <Reveal delay={Math.min(index * 0.04, 0.12)} key={project.slug}>
              <Card className="group overflow-hidden p-2 transition duration-300 hover:border-foreground/20 sm:p-3">
                <div className="grid gap-2 lg:grid-cols-[0.92fr_1.08fr]">
                  <div className="flex flex-col justify-between rounded-[1.15rem] bg-surface-raised p-6 sm:min-h-[390px] sm:p-8">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-foreground/70 shadow-[0_1px_2px_rgba(13,13,12,0.05)]">
                          {project.eyebrow}
                        </span>
                        <span className="text-[13px] text-muted">{project.year}</span>
                      </div>
                      <Link href={`/work/${project.slug}`}>
                        <h3 className="mt-8 max-w-lg text-balance text-4xl font-bold tracking-[-0.04em] transition group-hover:text-accent sm:text-[2.6rem] sm:leading-[1.1]">
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
                  <ProjectVisual className="hidden min-h-[420px] lg:block lg:min-h-full" variant={project.visual} />
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
            <p className="text-[15px] text-muted">Also written up:</p>
            {projects
              .filter((project) => !featuredSlugs.includes(project.slug))
              .map((project) => (
                <Link className="text-[15px] font-medium transition hover:text-accent" href={`/work/${project.slug}`} key={project.slug}>
                  {project.title} <span aria-hidden="true">↗</span>
                </Link>
              ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="research">
        <Reveal>
          <SectionHeading
            eyebrow="Publications"
            title="Research that makes model behavior easier to measure."
            description="Current work focuses on hierarchy quality, classification at large label scales, and the cost of reliable decisions. Submission status is stated plainly."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2">
          {publications.map((publication, index) => (
            <Reveal delay={index * 0.05} key={publication.title}>
              <Card className="research-card group flex h-full flex-col overflow-hidden p-6 transition duration-300 hover:border-foreground/20 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium tracking-[-0.01em] text-foreground/70 shadow-[0_1px_2px_rgba(13,13,12,0.05)]">
                    {publication.venue}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
                    <span className="size-1.5 rounded-full bg-accent" />
                    {publication.status}
                  </span>
                </div>
                <h3 className="mt-8 max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] transition group-hover:text-accent sm:text-[2.1rem]">{publication.title}</h3>
                <p className="mt-3 text-[15px] text-muted">{publication.role}</p>
                <div className="mt-7 flex-1">
                  <p className="text-base leading-7 text-muted">{publication.abstract}</p>
                </div>
                <div className="mt-8 border-t border-border pt-5">
                  <a className="text-sm font-medium transition hover:text-accent" href={`mailto:hello@moinuddin.app?subject=${encodeURIComponent(`Preprint request: ${publication.title}`)}`}>
                    Request manuscript <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="before">
        <Reveal>
          <SectionHeading
            eyebrow="Before AI"
            title="Started editing at 15. Built for 200+ clients."
            description="Cinematic video editing and motion graphics for clients worldwide. Fiverr first, then direct — across roughly five years, alongside school and then college."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <dl className="grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { value: "4.9", label: "Rating across 117 Fiverr reviews" },
              { value: "200+", label: "Clients over roughly five years, Fiverr then direct" },
              { value: "15", label: "Age I started, working under my sister's account" },
            ].map((stat, index) => (
              <div className={cn("py-7", index === 0 ? "sm:pr-8" : "sm:px-8")} key={stat.value}>
                <dt className="text-[2.4rem] font-bold leading-none tracking-[-0.045em] sm:text-[2.9rem]">{stat.value}</dt>
                <dd className="mt-3 max-w-[26ch] text-[15px] leading-6 text-muted">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-10 max-w-2xl text-pretty text-lg leading-8 text-muted">
            I was 15, which is too young to hold a seller account — it needs legal documents I did not have — so I worked
            under my sister&apos;s. Fiverr first, then direct clients as the work grew. None of it was assigned to me: I
            found the work, taught myself the craft, and delivered to a brief on a deadline for people who were paying.
            Scope, revisions, and clients across timezones taught me the parts of building that have nothing to do with
            code, years before I had a job title. The gig is still up and I take the occasional project, but AI is the
            work now.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <figure className="mt-12">
            <div className="overflow-hidden rounded-[1.25rem] border border-border bg-white p-4 shadow-card sm:p-7">
              <Image
                alt="Fiverr gig listing for cinematic video editing, rated 4.9 across 117 reviews"
                className="h-auto w-full"
                height={350}
                src="/fiverr-rating.png"
                width={1520}
              />
            </div>
            <figcaption className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              The gig as it stands today. The account is my sister&apos;s — her name and photo are redacted here at her
              request.
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-16">
            <p className="text-[15px] font-medium">Six of the 117.</p>
            <ReviewStack
              className="mt-6 max-w-3xl"
              cards={reviewCards.map((review) => ({
                id: review.src,
                content: (
                  <Image alt={review.alt} className="size-full object-cover" height={620} src={review.src} width={1440} />
                ),
              }))}
            />
            <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
              United States, Australia, United Kingdom, Mexico. Including a 4.3 — the average is 4.9, and it would be
              easy to show only fives.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="badminton">
        <Reveal>
          <SectionHeading eyebrow="Before that" title="Student Nationals. Silver, doubles." />
        </Reveal>
        <Reveal delay={0.05}>
          <div className="grid gap-10 border-t border-border pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <p className="text-[clamp(4rem,9vw,7rem)] font-bold leading-none tracking-[-0.05em]">
              Silver<span className="text-accent">.</span>
            </p>
            <div>
              <p className="max-w-xl text-pretty text-lg leading-8 text-muted">
                I picked up badminton at 11 and competed at state level before taking a doubles silver at Student
                Nationals in 2018. Lockdown ended it, but it was the first thing I got properly obsessed with — and the
                first time getting good at something was measured by someone other than me.
              </p>
              <dl className="mt-8 grid max-w-lg grid-cols-3 gap-px border border-border bg-border">
                <div className="bg-background p-5">
                  <dt className="text-2xl font-bold tracking-[-0.03em]">11</dt>
                  <dd className="mt-1.5 text-[15px] text-muted">Age I started</dd>
                </div>
                <div className="bg-background p-5">
                  <dt className="text-2xl font-bold tracking-[-0.03em]">2018</dt>
                  <dd className="mt-1.5 text-[15px] text-muted">Nationals silver</dd>
                </div>
                <div className="bg-background p-5">
                  <dt className="text-2xl font-bold tracking-[-0.03em]">State</dt>
                  <dd className="mt-1.5 text-[15px] text-muted">Level competed at</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="experience">
        <Reveal>
          <SectionHeading eyebrow="Experience" title="A short record of outcomes, not job descriptions." />
        </Reveal>
        <div className="border-t border-border">
          {experience.map((item) => (
            <Reveal key={item.company}>
              <article className="grid gap-5 border-b border-border py-8 md:grid-cols-[0.38fr_0.62fr] md:py-11">
                <div>
                  <p className="text-[15px] font-medium">{item.period}</p>
                  <p className="mt-1 text-[15px] text-muted">{item.location}</p>
                </div>
                <div>
                  <p className="text-[15px] font-medium text-accent">{item.company}</p>
                  <h3 className="mt-3 text-3xl font-bold tracking-[-0.035em] sm:text-4xl">{item.role}</h3>
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
            eyebrow="Technical interests"
            title="The questions I keep returning to."
            description="These are not keyword buckets. They are the parts of AI systems where I like to make ambiguity explicit and performance measurable."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interests.map((interest) => (
            <Card className="flex min-h-52 flex-col p-5 transition duration-300 hover:border-foreground/15 sm:p-6" key={interest.title}>
              <CardLabel>{interest.title}</CardLabel>
              <p className="mt-8 text-[15px] leading-6 text-muted">{interest.detail}</p>
            </Card>
          ))}
          <Card className="flex min-h-52 flex-col p-5 sm:col-span-2 sm:p-6">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent/10 px-3.5 py-2 text-[13px] font-medium text-accent">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              Now
            </span>
            <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em]">Evaluation-aware products</h3>
            <p className="mt-3 max-w-lg text-[15px] leading-6 text-muted">Building evaluation into the workflow so quality changes the product, not just a dashboard.</p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-28 lg:px-10" id="open-source">
        <Reveal>
          <SectionHeading
            eyebrow="Open source"
            title="The implementation is part of the argument."
            description="Public repositories include product code, typed APIs, tests, CI, deployment notes, and explicit limitations—not only screenshots."
          />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <Card className="flex flex-col overflow-hidden p-7">
            <CardLabel>GitHub snapshot</CardLabel>
            <p className="mt-9 text-7xl font-bold tracking-[-0.055em]">11</p>
            <p className="mt-2 text-base text-muted">public repositories</p>
            <div className="mt-10 space-y-4 border-t border-border pt-5 text-[15px]">
              <div className="flex items-center justify-between gap-4"><span className="text-muted">Stars</span><span className="font-medium">15</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-muted">Latest focus</span><span className="font-medium">DocuLens AI</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-muted">Languages</span><span className="font-medium">Python · TypeScript</span></div>
              <div className="flex items-center justify-between gap-4"><span className="text-muted">Licenses</span><span className="font-medium">MIT</span></div>
            </div>
            <a className="mt-8 inline-flex text-sm font-medium transition hover:text-accent" href="https://github.com/CodeWithMoin" rel="noreferrer" target="_blank">
              View GitHub profile ↗
            </a>
          </Card>
          <div className="space-y-3">
            {repositories.map((repository) => (
              <a className="group block" href={repository.href} key={repository.name} rel="noreferrer" target="_blank">
                <Card className="grid gap-5 p-6 transition hover:border-foreground/15 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold tracking-[-0.03em] transition group-hover:text-accent">{repository.name}</h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">{repository.description}</p>
                  </div>
                  <div className="flex gap-2 text-[13px] font-medium text-muted">
                    <span className="rounded-full bg-surface-raised px-3 py-1.5">{repository.language}</span>
                    <span className="rounded-full bg-surface-raised px-3 py-1.5">{repository.license}</span>
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
            eyebrow="Résumé"
            title="The concise version, embedded."
            description="One page covering experience, education, selected systems, research, and technical foundations."
          />
        </Reveal>
        <Card className="overflow-hidden p-2 sm:p-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-[1.1rem] border-b border-border bg-surface-raised px-4 py-3 sm:px-5">
            <p className="text-[15px] font-medium text-muted">Moinuddin Shaik · Résumé · PDF</p>
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
          <span className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-[15px] font-medium tracking-[-0.01em] text-foreground shadow-[0_1px_2px_rgba(13,13,12,0.05)]">Let&rsquo;s build something that has to work</span>
          <div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <h2 className="max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Hard problem. Clear evidence. Reliable system.
            </h2>
            <div className="lg:text-right">
              <a className="text-lg font-medium transition hover:text-accent" href="mailto:hello@moinuddin.app">hello@moinuddin.app ↗</a>
              <p className="mt-3 text-sm leading-6 text-muted">Available for applied science, ML systems, and early-stage AI product teams.</p>
              <div className="mt-6 flex items-center gap-3 lg:justify-end">
                <span className="relative inline-flex size-11 shrink-0 overflow-hidden rounded-full">
                  <Image
                    alt="Map of Hyderabad, India"
                    className="size-full object-cover grayscale contrast-[1.12]"
                    height={750}
                    src="/hyderabad-map.jpg"
                    width={1000}
                  />
                  <span aria-hidden="true" className="absolute left-[59%] top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-accent" />
                </span>
                <span className="text-sm text-muted">Hyderabad, India · 17.3850° N, 78.4867° E</span>
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6 text-sm text-muted">
            <p>© 2026 Moinuddin Shaik</p>
            <div className="flex flex-wrap gap-5">
              <a className="transition hover:text-foreground" href="mailto:hello@moinuddin.app">Email</a>
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
