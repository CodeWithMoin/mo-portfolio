"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useAudience } from "@/components/audience-provider";
import { primaryNav, sectionLabels, sectionOrder } from "@/lib/audience";
import { profile } from "@/lib/profile";


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { audience } = useAudience();
  // Built from sectionOrder so the menu can never list a section this audience
  // cannot actually scroll to, or miss one it can.
  const toLink = (id: string) => [sectionLabels[id] ?? id, `/#${id}`] as const;
  // Desktop shows the curated few; the mobile menu shows everything.
  const navLinks = [...primaryNav[audience].map(toLink), ["Contact", "/#contact"] as const];
  const links = [...sectionOrder[audience].map(toLink), ["Contact", "/#contact"] as const];

  return (
    <>
      {/* The header itself has no backdrop — logo and hamburger are floating pills with
          nothing behind them — so scrolled content (photos, dense text) passed directly
          behind the nav with no contrast buffer. This fades it out first. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 veil-top h-28 sm:h-32"
      />
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <nav aria-label="Primary navigation" className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link aria-label="Home" className="flex items-center gap-1.5" href="/">
              <Image
                alt="Moinuddin Shaik"
                className="size-9 rounded-[0.85rem] object-cover grayscale"
                height={512}
                priority
                src="/moinuddin.jpg"
                width={512}
              />
              <span className="size-1.5 rounded-full bg-accent" />
            </Link>
            <a
              className="hidden border-b border-foreground/25 pb-0.5 text-[15px] font-medium tracking-[-0.01em] transition hover:border-foreground/60 sm:block"
              href={profile.links.email}
            >
              {profile.email}
            </a>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2.5">
              {/* Links shared by both modes keep their key, so they slide to their new
                  position while only the mode-specific ones fade. popLayout keeps an
                  exiting link from shoving its neighbours mid-transition. */}
              <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">
                <AnimatePresence initial={false} mode="popLayout">
                  {navLinks.map(([label, href]) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      initial={{ opacity: 0, y: -8 }}
                      key={href}
                      layout
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        className="whitespace-nowrap border-b border-transparent pb-0.5 text-[15px] font-medium tracking-[-0.01em] text-muted transition-colors hover:border-foreground/40 hover:text-foreground"
                        href={href}
                      >
                        {label}
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </nav>
            </div>
            <button
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-12 place-items-center rounded-full border border-border bg-surface text-foreground shadow-nav transition duration-200 active:scale-[0.94] hover:border-foreground/20 lg:hidden"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? (
                <svg aria-hidden="true" fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" viewBox="0 0 24 24" width="17">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg aria-hidden="true" fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" viewBox="0 0 24 24" width="17">
                  <path d="M4 7h16M9 12h11M6 17h14" />
                </svg>
              )}
            </button>

            {open && (
              <div className="max-h-[70svh] w-52 overflow-y-auto rounded-[1.35rem] border border-border bg-surface p-2 shadow-nav">
                {links.map(([label, href]) => (
                  <Link
                    className="block rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-surface-raised hover:text-foreground"
                    href={href}
                    key={href}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <a
                  className="block rounded-xl px-4 py-2.5 text-sm text-muted transition hover:bg-surface-raised hover:text-foreground"
                  href={profile.links.resume}
                  target="_blank"
                >
                  Résumé
                </a>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
    </>
  );
}
