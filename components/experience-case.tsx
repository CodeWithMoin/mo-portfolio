"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { roles, type Role } from "@/lib/profile";
import { cn } from "@/lib/cn";

/**
 * Experience rendered as a case study rather than a job listing: what was broken,
 * what he personally built, the decisions that mattered, and what changed. Every
 * field is sourced from lib/profile.ts, which in turn restates published content.
 */
export function ExperienceCases() {
  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <ExperienceCase defaultOpen={index === 0} key={role.id} role={role} />
      ))}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{children}</p>;
}

function ExperienceCase({ role, defaultOpen }: { role: Role; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <article className="overflow-hidden rounded-[1.5rem] material">
      <button
        aria-expanded={open}
        className="flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 py-6 text-left transition hover:bg-surface-raised/50 sm:px-8 sm:py-7"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="text-2xl font-bold tracking-[-0.035em] sm:text-[1.9rem]">{role.title}</span>
          <span className="text-[15px] font-medium text-accent">
            {role.company} · {role.org}
          </span>
        </span>
        <span className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {role.period} · {role.location}
          <span
            aria-hidden="true"
            className={cn("grid size-7 place-items-center rounded-full border border-border transition", open && "rotate-45")}
          >
            <svg fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" viewBox="0 0 24 24" width="12">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </span>
      </button>

      <div className={cn("grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="border-t border-border px-6 pb-8 pt-7 sm:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.55fr_0.45fr] lg:gap-12">
              <div className="space-y-7">
                <div>
                  <Label>The problem</Label>
                  <p className="mt-2.5 text-pretty text-base leading-7 text-muted sm:text-[17px] sm:leading-8">{role.problem}</p>
                </div>
                <div>
                  <Label>What I built</Label>
                  <p className="mt-2.5 text-pretty text-base leading-7 sm:text-[17px] sm:leading-8">{role.built}</p>
                </div>
                <div>
                  <Label>Approach</Label>
                  <ul className="mt-3 space-y-2.5">
                    {role.approach.map((step) => (
                      <li className="flex gap-3 text-[15px] leading-6 text-muted" key={step}>
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>What changed</Label>
                  <dl className="mt-3 divide-y divide-border border-y border-border">
                    {role.outcomes.map((outcome) => (
                      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 py-3" key={outcome.label}>
                        <dt className="text-lg font-semibold tracking-[-0.03em]">{outcome.value}</dt>
                        <dd className="max-w-[26ch] text-right text-[13px] leading-5 text-muted">{outcome.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {role.photo && (
                  <figure className="relative aspect-[3/2] overflow-hidden rounded-[1.25rem] border border-border bg-surface-raised">
                    <Image
                      alt={role.photo.alt}
                      className="object-cover object-[center_58%]"
                      fill
                      sizes="(min-width: 1024px) 26rem, 100vw"
                      src={role.photo.src}
                    />
                  </figure>
                )}

                {role.note && <p className="text-[13px] leading-5 text-muted">{role.note}</p>}

                {role.caseStudy && (
                  <Link className="inline-flex text-sm font-medium transition hover:text-accent" href={`/work/${role.caseStudy}`}>
                    Read the full case study <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
