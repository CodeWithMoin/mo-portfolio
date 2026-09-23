import { ContactForm } from "@/components/contact-form";
import Image from "next/image";
import Link from "next/link";
import { BackgroundStrip } from "@/components/background-strip";
import { CommandBar } from "@/components/command-bar";
import { Dock } from "@/components/dock";
import { Hero } from "@/components/hero";
import { CapabilityMap } from "@/components/capability-map";
import { LabRetrieval } from "@/components/lab-retrieval";
import { ExperienceCases } from "@/components/experience-case";
import { ResultsTable } from "@/components/results-table";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SelectedWork } from "@/components/selected-work";
import { ReviewStack } from "@/components/review-stack";
import { Section, SectionFlow } from "@/components/section-flow";
import { SiteHeader } from "@/components/site-header";
import { StackSection } from "@/components/stack-section";
import { SystemReadout } from "@/components/system-readout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { projects, publications, repositories } from "@/lib/portfolio-data";
import { profile, testimonials } from "@/lib/profile";

const featuredSlugs = ["amazon-applied-science", "decode", "doculens-ai", "taxonomy-evaluation-research"];

const featuredProjects = featuredSlugs
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

const reviewCards = [
  { src: "/review-1.webp", alt: "Fiverr review, five stars, United States: a client names Moinuddin and cites audio editing and 3D motion graphics" },
  { src: "/review-2.webp", alt: "Fiverr review, five stars, United States: praises creative solutions and a 24-hour turnaround other editors declined" },
  { src: "/review-3.webp", alt: "Fiverr review, five stars, Australia: repeat client says they will use the service again" },
  { src: "/review-4.webp", alt: "Fiverr review, five stars, United Kingdom: calls the seller a consummate professional" },
  { src: "/review-5.webp", alt: "Fiverr review, five stars, Mexico: praises excellent work and punctual delivery" },
  { src: "/review-6.webp", alt: "Fiverr review, 4.3 stars, United States: notes talent and resourcefulness alongside criticism of communication" },
];

const milestones = [
  { age: "11", domain: "Badminton", detail: "State-level competition. Student Nationals silver in doubles, 2018. Stopped during lockdown." },
  { age: "14", domain: "Code", detail: "Started in 10th class, 2020." },
  { age: "15", domain: "Video", detail: "Editing for clients on Fiverr, then direct. 200+ clients over roughly five years." },
  { age: "20", domain: "Amazon", detail: "Applied Scientist Intern, 1 of ~200 across India. Selected via Amazon ML Summer School 2025 — 3,000 of 1.6 lakh applicants." },
  { age: "Now", domain: "Now", detail: "B.Tech CS (AI & ML), 9.09/10. Building AI systems, products, and research." },
];

// Measured, not guessed: at py-24 the space between one section's last line and the
// next section's rule was ~200px, a quarter of a laptop viewport of nothing.
const shell = "mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 md:py-14 lg:px-10";

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex self-start rounded-full border border-border bg-white px-4 py-2 text-[15px] font-medium tracking-[-0.01em] text-foreground shadow-[0_1px_2px_rgba(13,13,12,0.05),0_4px_12px_rgba(13,13,12,0.04)]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden">
        <SiteHeader />
        <Hero />

        <SectionFlow>
          <Section className={shell} id="work">
            <Reveal>
              <SelectedWork />
            </Reveal>
          </Section>

          <Section className={shell} id="results">
            <Reveal>
              <SectionHeading
                eyebrow="Results"
                title="Measured against a baseline, every time."
                description="A number without a comparison is a claim. Each row is what I built against what it replaced, measured the same way — and links to the write-up with the method."
              />
            </Reveal>
            <Reveal delay={0.05}>
              <ResultsTable />
            </Reveal>
          </Section>

          <Section className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 lg:px-10" id="testimonials">
            <div className="grid gap-5 lg:grid-cols-2">
              {testimonials.map((testimonial, index) => (
                <Reveal delay={index * 0.05} key={testimonial.name}>
                  <figure className="h-full rounded-2xl material p-7 sm:p-10">
                    <div className="flex items-start justify-between gap-4">
                      {/* The mark carries "this is a quote". Italics cannot: Geist ships
                          upright only here, so font-style: italic would be a synthesized
                          slant, which looks mechanical at display size. */}
                      <span aria-hidden="true" className="select-none text-[4.5rem] font-bold leading-[0.7] text-accent">
                        &ldquo;
                      </span>
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">From Amazon</p>
                    </div>
                    <blockquote className="mt-3 text-pretty text-2xl font-medium leading-[1.35] tracking-[-0.02em] sm:text-[1.75rem]">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-6 text-[15px] text-muted">
                      {testimonial.href ? (
                        <a className="font-medium text-foreground/80 transition hover:text-accent" href={testimonial.href} rel="noreferrer" target="_blank">
                          {testimonial.name}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground/80">{testimonial.name}</span>
                      )}
                      , {testimonial.role} · {testimonial.relation}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section className={shell} id="experience">
            <Reveal>
              <SectionHeading
                eyebrow="Experience"
                title="A short record of outcomes, not job descriptions."
                description="What was broken, what I built, the decisions that mattered, and what measurably changed."
              />
            </Reveal>
            <Reveal delay={0.05}>
              <ExperienceCases />
            </Reveal>
          </Section>

          <Section className={shell} id="build">
            <Reveal>
              <SectionHeading
                eyebrow="What I build"
                title="Four kinds of problem, and the work behind each one."
                description="Grouped by the problem, not the technology. Pick one and the evidence changes beside it."
              />
            </Reveal>
            <Reveal delay={0.05}>
              <CapabilityMap />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-14">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  Built with — every tool below is in at least one shipped project; ×n is how many
                </p>
                <StackSection />
              </div>
            </Reveal>
          </Section>

          <Section className="w-full border-y border-border bg-surface/60" id="lab">
            <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 md:py-16 lg:px-10">
            <Reveal>
              <SectionHeading
                eyebrow="Lab"
                title="How Ask finds an answer without a model."
                description="Not a simulation. Your question is tokenised in the browser, each term weighted by how rare it is across this site's own text, and every document ranked by cosine similarity. Nothing hidden: type, and watch each number change."
              />
            </Reveal>
            <Reveal delay={0.05}>
              <LabRetrieval />
            </Reveal>
            </div>
          </Section>

          <Section className={shell} id="research">
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
                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5">
                      {publication.caseStudy && (
                        <Link className="text-sm font-medium transition hover:text-accent" href={`/work/${publication.caseStudy.slug}`}>
                          {publication.caseStudy.label} <span aria-hidden="true">↗</span>
                        </Link>
                      )}
                      <a className="text-sm text-muted transition hover:text-foreground" href={`${profile.links.email}?subject=${encodeURIComponent(`Preprint request: ${publication.title}`)}`}>
                        Request manuscript ↗
                      </a>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>

          <Section className={shell} id="open-source">
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
                <p className="mt-9 text-7xl font-bold tracking-[-0.055em]">{repositories.length}</p>
                <p className="mt-2 text-base text-muted">repositories written up here</p>
                <div className="mt-10 space-y-4 border-t border-border pt-5 text-[15px]">
                  <div className="flex items-center justify-between gap-4"><span className="text-muted">Latest</span><span className="font-medium">MarkAlign · Trellis</span></div>
                  <div className="flex items-center justify-between gap-4"><span className="text-muted">Languages</span><span className="font-medium">Python · TypeScript</span></div>
                  <div className="flex items-center justify-between gap-4"><span className="text-muted">MIT-licensed</span><span className="font-medium">{repositories.filter((repository) => repository.license === "MIT").length} of {repositories.length}</span></div>
                </div>
                <a className="mt-8 inline-flex text-sm font-medium transition hover:text-accent" href={profile.links.github} rel="noreferrer" target="_blank">
                  View GitHub profile ↗
                </a>
              </Card>
              <div className="space-y-3">
                {repositories.map((repository) => (
                  <Link className="group block" href={repository.href} key={repository.name} rel={repository.external ? "noreferrer" : undefined} target={repository.external ? "_blank" : undefined}>
                    <Card className="grid gap-5 p-6 transition hover:border-foreground/15 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <h3 className="text-xl font-bold tracking-[-0.03em] transition group-hover:text-accent">{repository.name}</h3>
                        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-muted">{repository.description}</p>
                      </div>
                      <div className="flex gap-2 text-[13px] font-medium text-muted">
                        <span className="rounded-full bg-surface-raised px-3 py-1.5">{repository.language}</span>
                        {/* Unlicensed public code is all-rights-reserved; showing a
                            badge anyway would imply a licence that is not there. */}
                        {repository.license && (
                          <span className="rounded-full bg-surface-raised px-3 py-1.5">{repository.license}</span>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </Section>

          <Section className={shell} id="background">
            <Reveal>
              <SectionHeading
                eyebrow="Before AI"
                title="Two things I got good at before this one."
                description="Both are real and both are measured by someone other than me. Open either if you want the detail."
              />
            </Reveal>
            <BackgroundStrip />
          </Section>

          <Section className={shell} id="pattern">
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
                    <p className="text-[3.5rem] font-bold leading-none tracking-[-0.05em]" key={milestone.age}>{milestone.age}</p>
                  ))}
                </div>
                <div className="relative mt-8">
                  <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                  <div className="relative grid grid-cols-5">
                    {milestones.map((milestone, index) => (
                      <span
                        aria-hidden="true"
                        className={cn("size-3 rounded-full ring-4 ring-background", index === milestones.length - 1 ? "bg-accent" : "bg-foreground")}
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
                        className={cn("absolute left-0 top-2 size-3.5 rounded-full ring-4 ring-background", index === milestones.length - 1 ? "bg-accent" : "bg-foreground")}
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
          </Section>

          <Section className={shell} id="before">
            <Reveal>
              <SectionHeading
                eyebrow="Before AI"
                title="Started editing at 15. Built for 200+ clients."
                description="Cinematic video editing and motion graphics for clients worldwide. Fiverr first, then direct — across roughly five years, alongside school and then college."
              />
            </Reveal>
            <Reveal delay={0.05}>
              <div className="grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {[
                  { value: "4.9", label: "Rating across 117 Fiverr reviews" },
                  { value: "200+", label: "Clients over roughly five years, Fiverr then direct" },
                  { value: "15", label: "Age I started, working under my sister's account" },
                ].map((stat, index) => (
                  <div className={cn("py-7", index === 0 ? "sm:pr-8" : "sm:px-8")} key={stat.value}>
                    <p className="text-[2.4rem] font-bold leading-none tracking-[-0.045em] sm:text-[2.9rem]">{stat.value}</p>
                    <p className="mt-3 max-w-[26ch] text-[15px] leading-6 text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
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
                    sizes="(min-width: 1180px) 1120px, 100vw"
                    src="/fiverr-rating.png"
                    width={1520}
                  />
                </div>
                <figcaption className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  The gig as it stands today. The account is my sister&apos;s — her name and photo are redacted here at her request.
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
                    content: <Image alt={review.alt} className="size-full object-cover" height={517} sizes="(min-width: 768px) 48rem, 100vw" src={review.src} width={1200} />,
                  }))}
                />
                <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
                  United States, Australia, United Kingdom, Mexico. Including a 4.3 — the average is 4.9.
                </p>
              </div>
            </Reveal>
          </Section>

          <Section className={shell} id="badminton">
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
          </Section>
        </SectionFlow>

        {/* The one dark surface on the page. Everything above is evidence; this is
            the ask — so it gets the contrast, and the résumé lives here instead of
            in a section of its own. */}
        <footer className="mx-auto max-w-[1180px] px-5 pb-28 pt-10 sm:px-8 lg:px-10" id="contact">
          <div className="panel-ink overflow-hidden rounded-[2rem] p-7 text-background sm:p-10 lg:p-14">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-background/55">Contact · {profile.location.city}, {profile.location.country}</p>
            <h2 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-[4.4rem]">
              Hard problem. Clear evidence. <span className="text-accent">Reliable system.</span>
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
              <div>
            <p className="max-w-xl text-[17px] leading-8 text-background/65">Open to {profile.openTo}. Write here, or straight to the inbox.</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                className="btn-paper inline-flex min-h-[3.25rem] items-center gap-2 rounded-full px-7 text-[15px] font-medium"
                href={profile.links.email}
              >
                {profile.email} <span aria-hidden="true" className="nudge">↗</span>
              </a>
              <a
                className="inline-flex min-h-[3.25rem] items-center gap-2 rounded-full border border-background/20 px-7 text-[15px] font-medium transition hover:border-background/50"
                href={profile.links.resume}
                target="_blank"
              >
                Résumé · one page, PDF <span aria-hidden="true">↗</span>
              </a>
            </div>
              </div>
              <ContactForm />
            </div>

            <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-background/15 pt-6 text-sm text-background/55">
              <p>© {new Date().getFullYear()} {profile.name}</p>
              <div className="flex flex-wrap gap-5">
                <a className="transition hover:text-background" href={profile.links.github} rel="noreferrer" target="_blank">GitHub</a>
                <a className="transition hover:text-background" href={profile.links.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
                <a className="transition hover:text-background" href={profile.links.email}>Email</a>
              </div>
            </div>
          </div>
        </footer>

        <Dock />
        <CommandBar />
        <SystemReadout />
    </main>
  );
}
