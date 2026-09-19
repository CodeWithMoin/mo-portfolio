import Link from "next/link";
import { results } from "@/lib/results";

/**
 * The results table: metric, baseline, result. Laid out the way a paper would,
 * because that is the honest shape of this work — and the fastest thing on the page
 * for a recruiter to scan.
 */
export function ResultsTable() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] material">
      {/* Column header — desktop only; on small screens each row labels itself. */}
      <div className="hidden grid-cols-[1.25fr_1.25fr_0.9fr_0.9fr_1.2fr] gap-6 well border-b border-border px-7 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:grid">
        <span>System</span>
        <span>Metric</span>
        <span>Baseline</span>
        <span>Result</span>
        <span>Note</span>
      </div>

      <ul className="divide-y divide-border">
        {results.map((row) => (
          <li key={`${row.slug}-${row.metric}`}>
            <Link
              className="group relative grid gap-x-6 gap-y-3 px-5 py-5 transition-colors duration-300 before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:origin-center before:scale-y-0 before:rounded-full before:bg-accent before:transition-transform before:duration-300 hover:bg-white/70 hover:before:scale-y-100 sm:px-7 lg:grid-cols-[1.25fr_1.25fr_0.9fr_0.9fr_1.2fr] lg:items-baseline"
              href={`/work/${row.slug}`}
            >
              <span className="text-[15px] font-semibold tracking-[-0.02em] transition group-hover:text-accent">{row.system}</span>
              <span className="text-[15px] leading-6 text-muted">{row.metric}</span>

              <span className="flex items-baseline gap-2 lg:block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:hidden">Baseline</span>
                <span className="font-mono text-[15px] text-muted">{row.baseline}</span>
                {row.baselineNote && <span className="block text-[12px] leading-5 text-muted/80">{row.baselineNote}</span>}
              </span>

              <span className="flex items-baseline gap-2 lg:block">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted lg:hidden">Result</span>
                <span className="font-mono text-[17px] font-semibold text-foreground">
                  {row.result}
                  <span aria-hidden="true" className="ml-1.5 text-[13px] text-accent">
                    {row.better === "higher" ? "↑" : "↓"}
                  </span>
                  <span className="sr-only">{row.better === "higher" ? " (higher is better)" : " (lower is better)"}</span>
                </span>
              </span>

              <span className="text-[13px] leading-5 text-muted">{row.note ?? " "}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
