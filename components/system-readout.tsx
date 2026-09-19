"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAudience } from "@/components/audience-provider";
import { audienceLabels, sectionOrder } from "@/lib/audience";
import { index } from "@/lib/knowledge";
import { projects } from "@/lib/portfolio-data";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/**
 * Hidden readout, reachable with the Konami code.
 *
 * Every figure is read from the live modules rather than written down, so it is a
 * genuine instrument panel for the page rather than a decorative one. Rewarding
 * exploration is the point; nothing here is needed to understand the portfolio.
 */
export function SystemReadout() {
  const [open, setOpen] = useState(false);
  const { audience } = useAudience();

  useEffect(() => {
    let position = 0;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;

      const expected = KONAMI[position];
      const key = expected.startsWith("Arrow") ? event.key : event.key.toLowerCase();
      position = key === expected ? position + 1 : key === KONAMI[0] ? 1 : 0;

      if (position === KONAMI.length) {
        position = 0;
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows: [string, string][] = [
    ["mode", audienceLabels[audience].label.toLowerCase()],
    ["sections_visible", String(sectionOrder[audience].length)],
    ["projects_indexed", String(projects.length)],
    ["corpus_docs", String(index.docs.length)],
    ["vocabulary_terms", String(index.idf.size)],
    ["retrieval", "tf-idf · cosine"],
    ["runs_in", "your browser"],
    ["model_calls", "0"],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          animate={{ opacity: 1, y: 0 }}
          aria-label="System readout"
          className="fixed bottom-24 left-4 z-50 w-[18rem] rounded-2xl border border-border bg-surface/95 p-4 font-mono text-[11px] shadow-card backdrop-blur sm:bottom-28 sm:left-6"
          exit={{ opacity: 0, y: 8 }}
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <span className="uppercase tracking-[0.18em] text-muted">system</span>
            <button className="text-muted transition hover:text-foreground" onClick={() => setOpen(false)} type="button">
              ✕
            </button>
          </div>
          <dl className="mt-3 space-y-1.5">
            {rows.map(([key, value]) => (
              <div className="flex items-baseline justify-between gap-3" key={key}>
                <dt className="text-muted">{key}</dt>
                <dd className="truncate text-right text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 border-t border-border pt-2.5 text-[10px] leading-4 text-muted">
            You found this with the Konami code. Nothing here is load-bearing.
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
