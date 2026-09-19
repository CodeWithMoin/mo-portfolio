"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Interactive architecture pipeline.
 *
 * Stage relationships are derived from the ordered `nodes` array — a stage's input
 * is the previous stage's output. That is structurally true of every pipeline in
 * portfolio-data.ts, so no per-stage prose has to be invented to make it explorable.
 * `details` supplies sourced per-stage copy where it exists.
 */
export type StageDetail = { role?: string; note?: string };

function describe(nodes: string[], index: number) {
  return {
    input: index === 0 ? "External input" : nodes[index - 1],
    output: index === nodes.length - 1 ? "Final output" : nodes[index + 1],
    position: index === 0 ? "Entry" : index === nodes.length - 1 ? "Exit" : `Stage ${index + 1}`,
  };
}

export function Pipeline({
  nodes,
  note,
  details,
  className,
}: {
  nodes: string[];
  note?: string;
  details?: Record<string, StageDetail>;
  className?: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const baseId = useId();

  // Roving arrow-key navigation, so the diagram is explorable without a mouse.
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, index: number) => {
      const next = event.key === "ArrowRight" ? index + 1 : event.key === "ArrowLeft" ? index - 1 : null;
      if (next === null) return;
      event.preventDefault();
      const target = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-stage]")[
        (next + nodes.length) % nodes.length
      ];
      target?.focus();
    },
    [nodes.length],
  );

  const active = selected === null ? null : { index: selected, name: nodes[selected], ...describe(nodes, selected) };

  return (
    <figure className={cn("min-w-0 max-w-full rounded-[1.5rem] border border-border bg-grid p-5 shadow-[var(--card-shadow)] sm:p-8", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {nodes.length} stages · select to inspect
        </p>
        {selected !== null && (
          <button
            className="text-[13px] font-medium text-muted transition hover:text-foreground"
            onClick={() => setSelected(null)}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-5 w-full overflow-x-auto pb-2">
        <ol className="flex min-w-max items-stretch gap-2" aria-label="System architecture flow" ref={listRef}>
          {nodes.map((node, index) => {
            const isSelected = selected === index;
            return (
              <li className="flex items-stretch gap-2" key={node}>
                <button
                  aria-expanded={isSelected}
                  aria-controls={`${baseId}-detail`}
                  className={cn(
                    "group relative flex min-w-36 max-w-44 flex-col rounded-xl border px-4 py-4 text-left transition duration-200",
                    isSelected
                      ? "border-foreground/30 bg-background shadow-card"
                      : "border-border bg-background/90 shadow-sm hover:border-foreground/20 hover:bg-background",
                  )}
                  data-stage
                  onClick={() => setSelected(isSelected ? null : index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  type="button"
                >
                  <span className={cn("font-mono text-[11px] font-semibold transition", isSelected ? "text-accent" : "text-accent/70")}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-sm font-medium leading-5">{node}</span>
                  <span className="mt-2 text-[11px] text-muted opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    {isSelected ? "Selected" : "Inspect"}
                  </span>
                </button>
                {index < nodes.length - 1 && (
                  <span aria-hidden="true" className="relative flex w-6 items-center justify-center">
                    <span className="h-px w-full bg-border" />
                    <motion.span
                      animate={{ x: [-10, 10], opacity: [0, 1, 0] }}
                      className="absolute size-1.5 rounded-full bg-accent"
                      transition={{
                        duration: 1.1,
                        repeat: Infinity,
                        repeatDelay: nodes.length * 0.18,
                        delay: index * 0.18,
                        ease: "easeInOut",
                      }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div id={`${baseId}-detail`} role="region" aria-live="polite">
        {active ? (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 grid gap-5 rounded-2xl border border-border bg-background p-5 sm:grid-cols-[0.42fr_0.58fr] sm:p-6"
            initial={{ opacity: 0, y: 6 }}
            key={active.index}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{active.position}</p>
              <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">{active.name}</p>
              {details?.[active.name]?.role && (
                <p className="mt-3 text-[15px] leading-6 text-muted">{details[active.name].role}</p>
              )}
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Receives</dt>
                <dd className="mt-1.5 text-[15px] font-medium leading-6">{active.input}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Hands to</dt>
                <dd className="mt-1.5 text-[15px] font-medium leading-6">{active.output}</dd>
              </div>
              {details?.[active.name]?.note && (
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Detail</dt>
                  <dd className="mt-1.5 text-[15px] leading-6 text-muted">{details[active.name].note}</dd>
                </div>
              )}
            </dl>
          </motion.div>
        ) : (
          note && <figcaption className="mt-5 max-w-3xl text-sm leading-6 text-muted">{note}</figcaption>
        )}
      </div>
    </figure>
  );
}

/**
 * Card-sized, non-interactive rendering of the same pipeline, matching the dark
 * `visual-panel` treatment used by the bespoke project visuals. A pulse runs the
 * chain once it scrolls into view, so the card reads as a system rather than a list.
 */
export function PipelineVisual({ nodes, className }: { nodes: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const animate = inView && !reduceMotion;
  const shown = nodes.slice(0, 6);

  return (
    <div
      aria-label={`Architecture: ${nodes.join(" then ")}`}
      className={cn("visual-panel relative min-h-[320px] overflow-hidden rounded-[1.25rem] border border-white/10", className)}
      ref={ref}
      role="img"
    >
      <div className="absolute inset-2 overflow-hidden rounded-[1rem] bg-[#f4f5f7] text-[#17191f] ring-1 ring-white/10">
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between border-b border-[#d9dce2] bg-[#eff1f5] px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#6b707c]">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="flex gap-1.5">
              <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
              <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
              <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
            </span>
            Pipeline
          </span>
          <span className="normal-case tracking-normal">{nodes.length} stages</span>
        </div>

        <div className="product-grid absolute inset-0 top-11 flex flex-col justify-center gap-2.5 p-5">
          {shown.map((node, index) => (
            <motion.div
              animate={animate ? { opacity: 1, x: 0 } : undefined}
              className="flex items-center gap-3"
              initial={animate ? { opacity: 0, x: -8 } : false}
              key={node}
              transition={{ delay: index * 0.09, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="w-5 shrink-0 font-mono text-[9px] text-[#9aa0ab]">{String(index + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 truncate rounded-md border border-[#d9dce2] bg-white/90 px-3 py-2 text-[11px] font-medium">
                {node}
              </span>
              {index < shown.length - 1 && (
                <span aria-hidden="true" className="shrink-0 font-mono text-[10px] text-[#c0c5cd]">
                  ↓
                </span>
              )}
            </motion.div>
          ))}
          {nodes.length > shown.length && (
            <p className="pl-8 font-mono text-[10px] text-[#9aa0ab]">+{nodes.length - shown.length} more</p>
          )}
        </div>
      </div>
    </div>
  );
}
