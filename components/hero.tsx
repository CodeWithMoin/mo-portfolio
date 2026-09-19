"use client";

import Image from "next/image";
import { useAudience } from "@/components/audience-provider";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { AUDIENCES, type Audience } from "@/lib/audience";
import { profile, roles } from "@/lib/profile";
import { publications } from "@/lib/portfolio-data";
import { cn } from "@/lib/cn";

type Stat = { value: string; label: string; href?: string };

const amazon = roles.find((role) => role.id === "amazon")!;

/**
 * Mode-aware opening. The two audiences get a different claim, different evidence
 * for it, and a different first action — not the same page with swapped adjectives.
 */
const content: Record<Audience, { headline: React.ReactNode; subhead: React.ReactNode; stats: Stat[]; primary: Stat & { href: string }; secondary: Stat & { href: string } }> = {
  recruiter: {
    headline: (
      <>
        I build AI systems, and the <span className="text-accent">evaluation</span> that proves they work.
      </>
    ),
    subhead: (
      <>
        Applied Scientist Intern at <span className="font-medium text-foreground">Amazon RBS Sciences</span>. First author
        on a submitted paper, and nine systems written up with the numbers attached.
      </>
    ),
    stats: [
      { value: amazon.outcomes[0].value, label: amazon.outcomes[0].label, href: "#experience" },
      { value: amazon.outcomes[1].value, label: amazon.outcomes[1].label, href: "#experience" },
      { value: "First author", label: `${publications[0].title} · ${publications[0].venue}, ${publications[0].status}`, href: "#research" },
    ],
    primary: { value: "", label: "Résumé", href: profile.links.resume },
    secondary: { value: "", label: "See the work", href: "#work" },
  },
  founder: {
    headline: (
      <>
        I take an idea to a <span className="text-accent">running system</span>. Alone, if that&apos;s what it needs.
      </>
    ),
    subhead: (
      <>
        Product call, architecture, model work, backend, and the interface. Nine shipped systems — and before any of it,{" "}
        <span className="font-medium text-foreground">200+ video clients</span> I found and delivered myself from age 15.
      </>
    ),
    stats: [
      { value: "9", label: "systems written up end to end, most with public code", href: "#work" },
      { value: "0 → 1", label: "built solo: Decode, DocuLens, Attest, MarkAlign, Trellis", href: "#build" },
      { value: "200+", label: "video clients I found and delivered from age 15", href: "#before" },
    ],
    primary: { value: "", label: "See the work", href: "#work" },
    secondary: { value: "", label: "Email me", href: profile.links.email },
  },
};

/** One labelled fact in the snapshot card. */
function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-5 py-3">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{label}</dt>
      <dd className="text-right text-[13px] leading-5">{children}</dd>
    </div>
  );
}

/**
 * The snapshot a recruiter is scanning for — face, role, education, location,
 * availability, and the four links — in one place, above the fold. These are facts,
 * so the card is identical in both modes; only the claim beside it changes.
 */
function SnapshotCard() {
  const links = [
    { label: "Résumé", href: profile.links.resume },
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "GitHub", href: profile.links.github },
    { label: "Email", href: profile.links.email },
  ];

  return (
    <aside aria-label="Candidate snapshot" className="rounded-[1.5rem] material p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <Image
          alt={profile.name}
          className="size-[76px] shrink-0 rounded-2xl object-cover shadow-[0_0_0_1px_rgba(13,13,12,0.08),0_6px_14px_-4px_rgba(13,13,12,0.28)]"
          height={512}
          priority
          sizes="76px"
          src="/moinuddin.jpg"
          width={512}
        />
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-[-0.03em]">{profile.name}</p>
          <p className="text-[13px] text-muted">{profile.role}</p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-status/25 bg-status/10 px-2.5 py-1 text-[11.5px] font-medium text-foreground/80">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-status opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-status" />
            </span>
            Open to work
          </p>
        </div>
      </div>

      <dl className="mt-5 divide-y divide-border border-y border-border">
        <Fact label="Most recent">
          {amazon.title}, {amazon.company}
        </Fact>
        <Fact label="Education">
          {profile.education.degree}
        </Fact>
        <Fact label="Open to">{profile.openTo}</Fact>
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {links.map((link) => (
          <a
            className="btn-paper flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13px] font-medium"
            href={link.href}
            key={link.label}
            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            target={link.href.startsWith("mailto") ? undefined : "_blank"}
          >
            {link.label}
            <span aria-hidden="true" className="nudge text-muted">
              ↗
            </span>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function Hero() {
  const { audience } = useAudience();


  return (
    <section className="relative isolate mx-auto max-w-[1180px] px-5 pb-6 pt-24 sm:px-8 sm:pt-28 lg:px-10" id="top">
      <div aria-hidden="true" className="atmosphere" />
      <Reveal>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {profile.name} · {profile.role} · {profile.location.city}
        </p>
      </Reveal>

      <div className="mt-7 grid items-start gap-10 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,0.68fr)] lg:gap-14">
        <Reveal>
          {/*
            Both variants are rendered into the same grid cell and the stylesheet picks
            one from `data-audience` on <html>. That buys three things at once: the
            right claim is on screen before React hydrates (no flash on a ?v=founder
            link), the hero's height never changes between modes (so nothing below it
            shifts), and the crossfade is pure CSS.
            Only the recruiter variant is a real <h1>; the founder one takes
            role="heading", so exactly one level-1 heading is ever exposed.
          */}
          <div className="grid">
            {AUDIENCES.map((variant) => {
              const item = content[variant];
              const active = variant === audience;
              const headingClass =
                "max-w-[17ch] text-balance text-[clamp(2.3rem,4.9vw,4.2rem)] font-bold leading-[1.03] tracking-[-0.05em]";
              return (
                <div aria-hidden={!active} className="[grid-area:1/1]" data-hero-variant={variant} key={variant}>
                  {variant === "recruiter" ? (
                    <h1 className={headingClass}>{item.headline}</h1>
                  ) : (
                    <p aria-level={1} className={headingClass} role="heading">
                      {item.headline}
                    </p>
                  )}
                  <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted sm:text-[1.2rem] sm:leading-[2.1rem]">
                    {item.subhead}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Button className="min-h-[3.25rem] px-7 text-[15px]" href={item.primary.href}>
                      {item.primary.label}
                      <span aria-hidden="true" className="nudge text-background/60">↗</span>
                    </Button>
                    <Button className="min-h-[3.25rem] px-7 text-[15px]" href={item.secondary.href} variant="secondary">
                      {item.secondary.label}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <SnapshotCard />
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="mt-10 grid">
          {AUDIENCES.map((variant) => (
            <div
              aria-hidden={variant !== audience}
              className="grid divide-y divide-border [grid-area:1/1] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              data-hero-variant={variant}
              key={variant}
            >
              {content[variant].stats.map((stat, index) => {
                const last = index === content[variant].stats.length - 1;
                return (
                  <a
                    className={cn("group block py-5 transition sm:py-2", index === 0 ? "sm:pr-8" : "sm:px-8", last && "sm:pr-0")}
                    href={stat.href}
                    key={stat.value}
                  >
                    <p className="text-[1.75rem] font-bold tabular-nums leading-none tracking-[-0.045em] transition-colors duration-300 group-hover:text-accent sm:text-[2.1rem]">
                      {stat.value}
                    </p>
                    <p className="mt-2.5 max-w-[32ch] text-[13.5px] leading-[1.45rem] text-muted">{stat.label}</p>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </Reveal>

    </section>
  );
}
