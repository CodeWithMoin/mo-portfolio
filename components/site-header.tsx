"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  ["Work", "/#work"],
  ["Research", "/#research"],
  ["Before AI", "/#before"],
  ["Experience", "/#experience"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* The header itself has no backdrop — logo and hamburger are floating pills with
          nothing behind them — so scrolled content (photos, dense text) passed directly
          behind the nav with no contrast buffer. This fades it out first. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-background via-background/75 to-transparent sm:h-32"
      />
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-6 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <nav aria-label="Primary navigation" className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link aria-label="Home" className="flex items-center gap-1.5" href="/">
              <Image
                alt="Moinuddin Shaik"
                className="size-9 rounded-[0.85rem] object-cover grayscale"
                height={512}
                src="/moinuddin.jpg"
                width={512}
              />
              <span className="size-1.5 rounded-full bg-accent" />
            </Link>
            <a
              className="hidden border-b border-foreground/25 pb-0.5 text-[15px] font-medium tracking-[-0.01em] transition hover:border-foreground/60 sm:block"
              href="mailto:hello@moinuddin.app"
            >
              hello@moinuddin.app
            </a>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-12 place-items-center rounded-full border border-border bg-surface text-foreground shadow-nav transition duration-200 active:scale-[0.94] hover:border-foreground/20"
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
              <div className="w-52 overflow-hidden rounded-[1.35rem] border border-border bg-surface p-2 shadow-nav">
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
                  href="/Moinuddin_Shaik_Resume.pdf"
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
