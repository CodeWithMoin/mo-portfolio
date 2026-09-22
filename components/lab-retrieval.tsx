"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { index } from "@/lib/knowledge";
import { explain, search, tokenize, type Scored } from "@/lib/retrieval";
import { cn } from "@/lib/cn";

const EXAMPLES = [
  "citations that survive retrieval",
  "durable execution and compensation",
  "measuring whether a grader is right for the right reason",
  "low latency audio on cpu",
];

// Segments of a score bar, strongest term first. Opacity steps, not hues: the bar
// should read as one score split up, not a legend to decode.
const SEGMENT_OPACITY = [1, 0.7, 0.48, 0.32, 0.22];

/**
 * The document's own summary with the terms that scored marked. The same folding
 * the index uses, applied word by word, so "citations" lights up for "citation".
 */
function Snippet({ text, terms }: { text: string; terms: Set<string> }) {
  const parts = text.split(/(\s+)/);
  return (
    <p className="mt-3 text-[13.5px] leading-6 text-muted">
      {parts.map((part, position) => {
        const folded = tokenize(part)[0];
        return folded && terms.has(folded) ? (
          <mark className="rounded-[3px] bg-accent/15 px-0.5 text-foreground" key={position}>
            {part}
          </mark>
        ) : (
          <span key={position}>{part}</span>
        );
      })}
    </p>
  );
}

function Result({ hit, position, topScore }: { hit: Scored; position: number; topScore: number }) {
  const matched = new Set(hit.terms.map((term) => term.term));
  const relative = topScore > 0 ? hit.score / topScore : 0;

  return (
    <li>
      <Link className="group block rounded-xl border border-border bg-background p-4 transition hover:border-foreground/20" href={hit.doc.href ?? "/"}>
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex min-w-0 items-baseline gap-2.5">
            <span className="font-mono text-[11px] text-muted">{position + 1}</span>
            <span className="truncate text-[15px] font-medium transition group-hover:text-accent">{hit.doc.title}</span>
          </span>
          <span className="shrink-0 font-mono text-[12px] tabular-nums text-accent">{hit.score.toFixed(4)}</span>
        </div>

        {/* The score, split into what each term put in. Bars are on one scale across
            results, so a second-place bar is visibly shorter than the first. */}
        <div aria-hidden="true" className="mt-3 flex h-1.5 gap-px overflow-hidden rounded-full bg-surface-raised">
          {hit.terms.map((term, order) => (
            <motion.span
              animate={{ width: `${relative * (term.contribution / hit.score) * 100}%` }}
              className="h-full rounded-full bg-accent"
              initial={false}
              key={term.term}
              style={{ opacity: SEGMENT_OPACITY[Math.min(order, SEGMENT_OPACITY.length - 1)] }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-muted">
          {hit.terms.slice(0, 5).map((term, order) => (
            <li className="flex items-center gap-1.5" key={term.term}>
              <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" style={{ opacity: SEGMENT_OPACITY[Math.min(order, SEGMENT_OPACITY.length - 1)] }} />
              {term.term} <span className="text-foreground/70">{term.contribution.toFixed(3)}</span>
            </li>
          ))}
        </ul>

        <Snippet terms={matched} text={hit.doc.snippet} />
      </Link>
    </li>
  );
}

/**
 * The retrieval engine Ask falls back on, with the arithmetic left visible.
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
  const maxIdf = Math.max(...[...index.idf.values()], 1);

  return (
    <div className="overflow-hidden rounded-[1.5rem] material">
      <div className="flex flex-wrap items-center justify-between gap-3 well border-b border-border px-5 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          tf-idf · cosine · {index.docs.length} docs · {index.idf.size} terms
        </p>
        <p className="font-mono text-[11px] text-muted">runs in your browser · no model call</p>
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

        {/* The whole method in one line, in the same notation the read-outs use. */}
        <p className="mt-6 overflow-x-auto whitespace-nowrap rounded-xl border border-dashed border-border px-4 py-3 font-mono text-[11.5px] text-muted">
          <span className="text-foreground">w(t)</span> = tf(t) · (ln((N+1)/(df(t)+1)) + 1)
          <span className="mx-3 text-muted-strong">·</span>
          <span className="text-foreground">score(d)</span> = Σ<sub>t</sub> q̂(t) · d̂(t)
          <span className="mx-3 text-muted-strong">·</span>
          q̂, d̂ unit length, so the sum is the cosine
        </p>

        <div className="mt-7 grid gap-7 lg:grid-cols-[0.38fr_0.62fr] lg:gap-9">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">01 · tokens → idf weight</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Stopwords dropped, plurals folded. A term in every document is worth little; a rare one is worth a lot.
            </p>
            <ul className="mt-4 space-y-1.5">
              {terms.length === 0 && <li className="text-[13px] text-muted">Nothing indexable in that query.</li>}
              {terms.map((term, position) => (
                <li className="flex items-center gap-3" key={`${term.term}-${position}`}>
                  <span
                    className={cn(
                      "relative min-w-0 flex-1 overflow-hidden rounded-md border px-2.5 py-1.5 font-mono text-[12px]",
                      term.inVocabulary ? "border-border bg-background" : "border-dashed border-border bg-transparent text-muted line-through",
                    )}
                  >
                    {/* Rarity as a fill behind the term: the bar is idf on the corpus scale. */}
                    {term.idf !== null && (
                      <motion.span
                        animate={{ width: `${(term.idf / maxIdf) * 100}%` }}
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 bg-accent/10"
                        initial={false}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative truncate">{term.term}</span>
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-accent">{term.idf ? term.idf.toFixed(2) : "—"}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-[10px] text-muted">struck through = not in the corpus, contributes nothing</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">02 · ranked by cosine, with the evidence</p>
            <p className="mt-2 text-[13px] leading-5 text-muted">
              Each bar is one score, split by term. The highlighted words are why that document scored — the same words, folded the same way.
            </p>

            <ol className="mt-4 space-y-2.5">
              {results.length === 0 && (
                <li className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-[13px] text-muted">
                  No document shares a term with that query. Ask says so here, rather than guessing.
                </li>
              )}
              {results.map((hit, position) => (
                <Result hit={hit} key={hit.doc.id} position={position} topScore={topScore} />
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
