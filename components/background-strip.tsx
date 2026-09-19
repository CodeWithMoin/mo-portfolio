"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { priorLife } from "@/lib/profile";
import { cn } from "@/lib/cn";

/**
 * Recruiter mode keeps the pre-AI history on the page without spending two full
 * sections on it. One line each, open on demand.
 */
export function BackgroundStrip() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Reveal>
      <div className="border-t border-border">
        {priorLife.map((line) => {
          const expanded = open === line.id;

          return (
            <div className="border-b border-border" key={line.id}>
              <button
                aria-expanded={expanded}
                className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                onClick={() => setOpen(expanded ? null : line.id)}
                type="button"
              >
                <span className="text-xl font-semibold tracking-[-0.03em] transition group-hover:text-accent sm:text-2xl">
                  {line.headline}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-full border border-border bg-surface text-muted transition duration-300",
                    expanded && "rotate-45 border-foreground/25 text-foreground",
                  )}
                >
                  <svg fill="none" height="14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" viewBox="0 0 24 24" width="14">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>

              <div
                className={cn(
                  "grid transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  expanded ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl text-pretty text-base leading-8 text-muted">{line.detail}</p>
                  {line.id === "video" && (
                    <figure className="mt-7 max-w-2xl">
                      <div className="overflow-hidden rounded-[1.25rem] border border-border bg-white p-3 shadow-card sm:p-5">
                        <Image
                          alt="Fiverr gig listing for cinematic video editing, rated 4.9 across 117 reviews"
                          className="h-auto w-full"
                          height={350}
                          sizes="(min-width: 768px) 42rem, 100vw"
                          src="/fiverr-rating.png"
                          width={1520}
                        />
                      </div>
                      <figcaption className="mt-3 text-sm leading-6 text-muted">The account is my sister&apos;s — I was too young to hold one. Her name and photo are redacted at her request.</figcaption>
                    </figure>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
