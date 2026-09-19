"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { capabilities, projectsFor } from "@/lib/capabilities";
import { cn } from "@/lib/cn";

/**
 * Capabilities and the projects that back them, in one view. Selecting a capability
 * swaps the evidence beside it, so a claim is never more than a click from the work
 * that justifies it.
 */
/** One panel whose contents swap, so every tab controls the same stable element. */
const PANEL_ID = "capability-panel";

export function CapabilityMap() {
  const [activeId, setActiveId] = useState(capabilities[0].id);
  const listRef = useRef<HTMLDivElement>(null);
  const active = capabilities.find((capability) => capability.id === activeId)!;
  const shown = projectsFor(active);

  // role="tablist" promises arrow-key navigation; without it the role is a lie to
  // anyone driving this by keyboard.
  const onKeyDown = useCallback((event: React.KeyboardEvent, position: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (delta === 0) return;
    event.preventDefault();

    const next = capabilities[(position + delta + capabilities.length) % capabilities.length];
    setActiveId(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#tab-${next.id}`)?.focus();
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
      <div aria-label="Capabilities" className="flex flex-col" ref={listRef} role="tablist">
        {capabilities.map((capability, position) => {
          const selected = capability.id === activeId;
          return (
            <button
              aria-controls={PANEL_ID}
              aria-selected={selected}
              className={cn(
                "group border-b border-border py-6 text-left transition first:border-t",
                selected ? "border-b-foreground/25" : "hover:border-b-foreground/15",
              )}
              id={`tab-${capability.id}`}
              key={capability.id}
              onClick={() => setActiveId(capability.id)}
              onKeyDown={(event) => onKeyDown(event, position)}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className={cn(
                    "text-2xl font-bold tracking-[-0.035em] transition sm:text-[1.75rem]",
                    selected ? "text-foreground" : "text-muted group-hover:text-foreground",
                  )}
                >
                  {capability.title}
                </span>
                <span className="shrink-0 font-mono text-[11px] text-muted">
                  {String(capability.slugs.length).padStart(2, "0")}
                </span>
              </div>
              <AnimatePresence initial={false}>
                {selected && (
                  <motion.p
                    animate={{ height: "auto", opacity: 1 }}
                    className="overflow-hidden text-[15px] leading-6 text-muted"
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="block pt-3">{capability.blurb}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div aria-labelledby={`tab-${active.id}`} id={PANEL_ID} role="tabpanel">
        <AnimatePresence mode="wait">
          <motion.ul
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
            exit={{ opacity: 0, y: -4 }}
            initial={{ opacity: 0, y: 8 }}
            key={active.id}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {shown.map((project) => (
              <li key={project.slug}>
                <Link
                  className="material lift group block rounded-2xl p-5 sm:p-6"
                  href={`/work/${project.slug}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="text-xl font-bold tracking-[-0.03em] transition group-hover:text-accent">
                      {project.title}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{project.year}</span>
                  </div>
                  <p className="mt-2.5 text-[15px] leading-6 text-muted">{project.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3.5">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <span className="text-[13px] text-muted" key={metric.label}>
                        <span className="font-medium text-foreground">{metric.value}</span> {metric.label}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
