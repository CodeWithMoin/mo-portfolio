"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { index } from "@/lib/knowledge";
import { explain, search, tokenize } from "@/lib/retrieval";
import { cn } from "@/lib/cn";

const EXAMPLES = [
  "citations that survive retrieval",
  "durable execution and compensation",
  "measuring whether a grader is right for the right reason",
  "low latency audio on cpu",
];

/**
 * The retrieval engine behind the ask bar, with the arithmetic left visible.
 *
 * This is not a simulation. It tokenizes in the browser, looks each term up in a
 * real inverse-document-frequency table built from this site's own text, and ranks
 * by cosine similarity. Every number on screen is recomputed as you type.
 */
export function LabRetrieval() {
  const [query, setQuery] = useState(EXAMPLES[0]);

  const { terms, results } = useMemo(() => {
    return { terms: explain(index, query), results: search(index, query, 4) };
  }, [query]);

  const topScore = results[0]?.score ?? 0;

  return (
    <div className="overflow-hidden rounded-[1.5rem] material">
      <div className="flex flex-wrap items-center justify-between gap-3 well border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          tf-idf · cosine · {index.docs.length} docs · {index.idf.size} terms
        </p>
        <p className="font-mono text-[11px] text-muted">runs locally · no model call</p>
      </div>

      <div className="p-5 sm:p-7">
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Query</span>
          <input
            className="mt-2.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none transition focus:border-foreground/40 focus-visible:outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Describe something and see what it retrieves…"
            value={query}
          />
        </label>

        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] transition",
                example === query
                  ? "border-foreground/25 bg-background text-foreground"
                  : "border-border bg-background text-muted hover:border-foreground/20 hover:text-foreground",
              )}
              key={example}
              onClick={() => setQuery(example)}
              type="button"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-[0.38fr_0.62fr] lg:gap-9">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              01 · tokens → idf weight
            </p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Stopwords dropped, plurals folded. A term in every document is worth little; a rare one is worth a lot.
            </p>
            <ul className="mt-4 space-y-1.5">
              {terms.length === 0 && <li className="text-[13px] text-muted">Nothing indexable in that query.</li>}
              {terms.map((term, position) => (
                <li className="flex items-center gap-3" key={`${term.term}-${position}`}>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate rounded-md border px-2.5 py-1.5 font-mono text-[12px]",
                      term.inVocabulary
                        ? "border-border bg-background"
                        : "border-dashed border-border bg-transparent text-muted line-through",
                    )}
                  >
                    {term.term}
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-[11px] text-accent">
                    {term.idf ? term.idf.toFixed(2) : "—"}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[10px] text-muted">
              struck through = not in the corpus, contributes nothing
            </p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">02 · ranked by cosine</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Both vectors are unit length, so the dot product is the cosine. 1.0 would be identical text.
            </p>

            <ol className="mt-4 space-y-2.5">
              {results.length === 0 && (
                <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted">
                  No document shares a term with that query. The ask bar returns nothing here rather than guessing.
                </li>
              )}
              {results.map((hit, position) => (
                <li key={hit.doc.id}>
                  <Link
                    className="group block rounded-xl border border-border bg-background p-4 transition hover:border-foreground/20"
                    href={hit.doc.href ?? "/"}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="flex min-w-0 items-baseline gap-2.5">
                        <span className="font-mono text-[11px] text-muted">{position + 1}</span>
                        <span className="truncate text-[15px] font-medium transition group-hover:text-accent">
                          {hit.doc.title}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[12px] text-accent">{hit.score.toFixed(4)}</span>
                    </div>

                    <div aria-hidden="true" className="mt-2.5 h-1 overflow-hidden rounded-full bg-surface-raised">
                      <motion.div
                        animate={{ width: `${topScore > 0 ? (hit.score / topScore) * 100 : 0}%` }}
                        className="h-full rounded-full bg-accent"
                        initial={false}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>

                    <p className="mt-2.5 font-mono text-[11px] text-muted">
                      {hit.terms
                        .slice(0, 4)
                        .map((term) => `${term.term} ${term.contribution.toFixed(3)}`)
                        .join("  ·  ")}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
