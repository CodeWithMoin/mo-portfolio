"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Answer } from "@/lib/knowledge";
import { cn } from "@/lib/cn";

const VIA_LABEL: Record<Answer["via"], string> = {
  matched: "Known question",
  retrieved: "Retrieved",
  none: "No match",
};

/**
 * Renders one answer, including how it was produced. The provenance badge is not
 * decoration: this thing has no generation step, and saying so is the point.
 */
/**
 * Reveals an answer the way a streamed one arrives: the summary word by word, then
 * each bullet, then the links. The text is already complete — this is pacing, so a
 * long answer is read from the top instead of landing as a wall. Returns how many
 * words are visible so far, and whether it has finished.
 */
function useStreamedWords(total: number, enabled: boolean) {
  const [shown, setShown] = useState(enabled ? 0 : total);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(total);
      return;
    }
    // Long answers speed up, so nothing takes more than about three seconds.
    const perTick = Math.max(1, Math.ceil(total / 110));
    const timer = window.setInterval(() => {
      setShown((current) => {
        const next = Math.min(total, current + perTick);
        if (next >= total) window.clearInterval(timer);
        return next;
      });
    }, 28);
    return () => window.clearInterval(timer);
  }, [enabled, total]);

  return { shown, done: shown >= total };
}

export function AnswerPanel({
  answer,
  onDismiss,
  onNavigate,
  stream = false,
  className,
}: {
  answer: Answer;
  /** Pace the answer in, as the chat does. The command palette shows it at once. */
  stream?: boolean;
  onDismiss?: () => void;
  /** Lets a modal host close itself before navigating. */
  onNavigate?: (href: string) => void;
  className?: string;
}) {
  const [showScores, setShowScores] = useState(false);
  const internal = (href: string) => href.startsWith("/");

  // One word budget spent in reading order: summary first, then bullet by bullet.
  const parts = useMemo(() => [answer.text, ...(answer.bullets ?? [])].map((part) => part.split(" ")), [answer]);
  const total = parts.reduce((sum, words) => sum + words.length, 0);
  const { shown, done } = useStreamedWords(total, stream);
  const visible = (index: number) => {
    const before = parts.slice(0, index).reduce((sum, words) => sum + words.length, 0);
    const count = Math.max(0, Math.min(parts[index].length, shown - before));
    return { started: shown > before, text: parts[index].slice(0, count).join(" "), partial: count < parts[index].length };
  };
  const caret = <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-foreground" />;
  const summary = visible(0);

  return (
    // aria-busy holds the announcement until the text is whole, so a screen reader
    // hears the answer once rather than a word at a time.
    <div aria-busy={!done} className={cn("", className)} role="status">
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className={cn("size-1.5 rounded-full", answer.via === "none" ? "bg-muted-strong" : "bg-accent")} />
          {VIA_LABEL[answer.via]}
        </span>
        {onDismiss && (
          <button className="text-[13px] text-muted transition hover:text-foreground" onClick={onDismiss} type="button">
            Back
          </button>
        )}
      </div>

      <p className="mt-4 text-pretty text-[17px] leading-7">
        {summary.text}
        {summary.partial && caret}
      </p>

      {answer.bullets && answer.bullets.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {answer.bullets.map((bullet, index) => {
            const line = visible(index + 1);
            if (!line.started) return null;
            return (
              <li className="flex gap-3 text-[15px] leading-6 text-muted" key={bullet}>
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span>
                  {line.text}
                  {line.partial && caret}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {done && answer.sources.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          {answer.sources.map((source) =>
            source.href === "#" ? (
              <span className="text-[13px] text-muted" key={source.label}>
                {source.label}
              </span>
            ) : internal(source.href) ? (
              <Link
                className="rounded-full border border-border bg-background px-3 py-1.5 text-[13px] font-medium transition hover:border-foreground/20"
                href={source.href}
                key={source.label}
                onClick={
                  onNavigate
                    ? (event) => {
                        event.preventDefault();
                        onNavigate(source.href);
                      }
                    : undefined
                }
              >
                {source.label} ↗
              </Link>
            ) : (
              <a
                className="rounded-full border border-border bg-background px-3 py-1.5 text-[13px] font-medium transition hover:border-foreground/20"
                href={source.href}
                key={source.label}
                rel="noreferrer"
                target="_blank"
              >
                {source.label} ↗
              </a>
            ),
          )}
        </div>
      )}

      {done && answer.scored && answer.scored.length > 0 && (
        <div className="mt-4">
          <button
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition hover:text-foreground"
            onClick={() => setShowScores((value) => !value)}
            type="button"
          >
            {showScores ? "Hide" : "Show"} scoring · tf-idf cosine
          </button>
          {showScores && (
            <table className="mt-3 w-full border-collapse text-left font-mono text-[11px]">
              <thead className="text-muted">
                <tr>
                  <th className="border-b border-border pb-1.5 font-normal">document</th>
                  <th className="border-b border-border pb-1.5 font-normal">cosine</th>
                  <th className="border-b border-border pb-1.5 font-normal">top terms</th>
                </tr>
              </thead>
              <tbody>
                {answer.scored.map((hit) => (
                  <tr key={hit.doc.id}>
                    <td className="border-b border-border py-1.5 pr-3">{hit.doc.title}</td>
                    <td className="border-b border-border py-1.5 pr-3 text-accent">{hit.score.toFixed(4)}</td>
                    <td className="border-b border-border py-1.5 text-muted">
                      {hit.terms.slice(0, 3).map((term) => term.term).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
