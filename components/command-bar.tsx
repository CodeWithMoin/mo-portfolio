"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnswerPanel } from "@/components/answer-panel";
import { useAudience } from "@/components/audience-provider";
import { AUDIENCES, audienceLabels, sectionLabels, sectionOrder } from "@/lib/audience";
import { ask, suggestedQuestions, type Answer } from "@/lib/knowledge";
import { projects } from "@/lib/portfolio-data";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/cn";

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: "Ask" | "Sections" | "Work" | "Mode" | "Links";
  run: () => void;
  keywords?: string;
};

/**
 * Keyboard-only: opened with ⌘K / Ctrl+K or "/". There is no on-screen trigger —
 * the hero's chat is the visible way to ask; this is the fast path for people who
 * reach for a shortcut.
 *
 * One overlay, two jobs: jump anywhere in the site, or ask a question about the
 * work. They share an input because a visitor should not have to know which one
 * they want before they start typing.
 */
export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [answer, setAnswer] = useState<Answer | null>(null);

  const { audience, setAudience } = useAudience();
  // The trigger lives inside the bottom toolbar, whose `translate-y-*` compiles to
  // a real transform — and a transformed ancestor becomes the containing block for
  // `position: fixed`, which trapped this overlay inside a 165px pill. Portalling to
  // <body> puts it back on the viewport regardless of where the trigger sits.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setPortalTarget(document.body), []);
  const baseId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setAnswer(null);
    restoreFocusTo.current?.focus();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      if (href.startsWith("#")) {
        document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" });
        return;
      }
      window.location.href = href;
    },
    [close],
  );

  const runAsk = useCallback((question: string) => {
    setAnswer(ask(question));
  }, []);

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [];

    for (const id of sectionOrder[audience]) {
      list.push({
        id: `section:${id}`,
        label: sectionLabels[id] ?? id,
        hint: "Jump to section",
        group: "Sections",
        run: () => go(`#${id}`),
      });
    }

    for (const project of projects) {
      list.push({
        id: `project:${project.slug}`,
        label: project.title,
        hint: project.eyebrow,
        group: "Work",
        keywords: `${project.stack.join(" ")} ${project.summary}`,
        run: () => go(`/work/${project.slug}`),
      });
    }

    for (const option of AUDIENCES) {
      if (option === audience) continue;
      list.push({
        id: `mode:${option}`,
        label: `Switch to ${audienceLabels[option].label} mode`,
        hint: audienceLabels[option].hint,
        group: "Mode",
        run: () => {
          setAudience(option);
          close();
        },
      });
    }

    list.push(
      { id: "link:resume", label: "Open résumé", hint: "PDF", group: "Links", run: () => go(profile.links.resume) },
      { id: "link:email", label: `Email ${profile.email}`, group: "Links", run: () => go(profile.links.email) },
      { id: "link:github", label: "GitHub", hint: "CodeWithMoin", group: "Links", run: () => go(profile.links.github) },
      { id: "link:linkedin", label: "LinkedIn", group: "Links", run: () => go(profile.links.linkedin) },
    );

    return list;
  }, [audience, close, go, setAudience]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Asking is always the first option once there is enough to ask about, so the
  // question path never depends on the visitor finding a mode toggle.
  const askRow: Command | null =
    query.trim().length > 2
      ? {
          id: "ask",
          label: `Ask: “${query.trim()}”`,
          hint: "Answered from the portfolio only",
          group: "Ask",
          run: () => runAsk(query.trim()),
        }
      : null;

  const rows = useMemo(() => (askRow ? [askRow, ...filtered] : filtered), [askRow, filtered]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isToggle = (event.key === "k" || event.key === "K") && (event.metaKey || event.ctrlKey);
      if (isToggle) {
        event.preventDefault();
        event.stopPropagation();
        restoreFocusTo.current = document.activeElement as HTMLElement;
        setOpen((value) => !value);
        return;
      }
      // "/" opens it too, but not while the visitor is typing somewhere else.
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing && !open) {
        event.preventDefault();
        event.stopPropagation();
        restoreFocusTo.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    // Capture phase on the document: a bubble-phase window listener runs last, so
    // anything that stops propagation — or the browser's own Cmd+K omnibox binding —
    // gets there first. Capture lets the page claim the key before that happens.
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /**
     * `aria-modal` promises focus stays inside the dialog. Without this, Tab walks
     * straight out into the page behind the overlay — the assistive-tech equivalent
     * of the modal not being modal at all.
     */
    const onTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Wrap at both ends, and pull focus back in if it escaped some other way.
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onTab, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onTab, true);
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [cursor, rows.length]);

  const onInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (answer) setAnswer(null);
      else close();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (rows.length === 0) return;
      setCursor((value) => (value + (event.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      rows[cursor]?.run();
    }
  };

  const grouped = useMemo(() => {
    const groups = new Map<string, { command: Command; index: number }[]>();
    rows.forEach((command, index) => {
      const bucket = groups.get(command.group) ?? [];
      bucket.push({ command, index });
      groups.set(command.group, bucket);
    });
    return [...groups.entries()];
  }, [rows]);

  return (
    <>
      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12svh] sm:pt-[16svh]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div aria-hidden="true" className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={close} />

            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              aria-label="Command and question bar"
              aria-modal="true"
              className="relative flex max-h-[72svh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-card"
              ref={dialogRef}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              initial={{ opacity: 0, y: -6, scale: 0.99 }}
              role="dialog"
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 border-b border-border px-5 py-4 transition-colors focus-within:border-foreground/20">
                <span aria-hidden="true" className="font-mono text-[13px] text-accent">
                  ›
                </span>
                <input
                  aria-activedescendant={rows[cursor] ? `cmd-${rows[cursor].id}` : undefined}
                  aria-autocomplete="list"
                  aria-controls={`${baseId}-list`}
                  aria-expanded="true"
                  aria-label="Search sections and projects, or ask a question"
                  role="combobox"
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted focus-visible:outline-none"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setAnswer(null);
                  }}
                  onKeyDown={onInputKeyDown}
                  placeholder="Jump to a section, or ask what he built…"
                  ref={inputRef}
                  value={query}
                />
                <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
                  esc
                </kbd>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2" id={`${baseId}-list`} ref={listRef} role="listbox">
                {answer ? (
                  <AnswerPanel answer={answer} className="p-3" onDismiss={() => setAnswer(null)} onNavigate={go} />
                ) : (
                  <>
                    {!query && (
                      <div className="px-3 pb-2 pt-3">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Try asking</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {suggestedQuestions.map((suggestion) => (
                            <button
                              className="rounded-full border border-border bg-background px-3 py-1.5 text-[13px] text-muted transition hover:border-foreground/20 hover:text-foreground"
                              key={suggestion.id}
                              onClick={() => {
                                setQuery(suggestion.question);
                                runAsk(suggestion.question);
                              }}
                              type="button"
                            >
                              {suggestion.question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {rows.length === 0 && (
                      <p className="px-4 py-8 text-center text-[15px] text-muted">No section or project matches that.</p>
                    )}

                    {grouped.map(([group, entries]) => (
                      <div aria-label={group} className="pb-1 pt-3" key={group} role="group">
                        <p aria-hidden="true" className="px-3 pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{group}</p>
                        {entries.map(({ command, index }) => (
                          <button
                            className={cn(
                              "flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-left transition",
                              index === cursor ? "bg-surface-raised" : "hover:bg-surface-raised/60",
                            )}
                            aria-selected={index === cursor}
                            data-active={index === cursor}
                            id={`cmd-${command.id}`}
                            key={command.id}
                            onClick={command.run}
                            onMouseMove={() => setCursor(index)}
                            role="option"
                            type="button"
                          >
                            <span className="min-w-0 truncate text-[15px] font-medium">{command.label}</span>
                            {command.hint && (
                              <span className="shrink-0 text-[13px] text-muted">{command.hint}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <span>↑↓ move · ⏎ select · esc close · / reopen</span>
                <span>{audienceLabels[audience].label} mode</span>
              </div>
            </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget,
        )}
    </>
  );
}
