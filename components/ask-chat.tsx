"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnswerPanel } from "@/components/answer-panel";
import { askRemote, type ChatTurn } from "@/lib/ask-remote";
import { ask, suggestedQuestions, type Answer } from "@/lib/knowledge";
import { projects } from "@/lib/portfolio-data";
import { cn } from "@/lib/cn";

type Exchange = {
  id: number;
  question: string;
  /** Streamed model text, when the endpoint answered. */
  text: string;
  /** Which model produced it, for the badge. */
  provider?: string;
  /** Deterministic answer, when it did not. */
  local: Answer | null;
  /** The model's daily quota was spent, so this one was answered locally. */
  limited?: boolean;
  status: "thinking" | "streaming" | "done";
};

type AskContextValue = {
  exchanges: Exchange[];
  busy: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Opens the side chat and asks. */
  submit: (question: string) => void;
  clear: () => void;
};

const AskContext = createContext<AskContextValue | null>(null);

function useAsk() {
  const context = useContext(AskContext);
  if (!context) throw new Error("useAsk must be used inside an AskProvider");
  return context;
}

/**
 * Reveals model text word by word as it arrives. Gemini's endpoint tends to send a
 * whole answer in one burst after it finishes thinking, so without this a "streamed"
 * answer still lands as a block. Catches up faster the further behind it is.
 */
function useTypedText(target: string) {
  const [shown, setShown] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;
  const words = target.split(/(\s+)/);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(Number.MAX_SAFE_INTEGER);
      return;
    }
    const timer = window.setInterval(() => {
      setShown((current) => {
        const total = targetRef.current.split(/(\s+)/).length;
        if (current >= total) return current;
        return Math.min(total, current + Math.max(1, Math.ceil((total - current) / 40)));
      });
    }, 30);
    return () => window.clearInterval(timer);
  }, []);

  return { text: words.slice(0, shown).join(""), typing: shown < words.length };
}

function TypedAnswer({ text, streaming }: { text: string; streaming: boolean }) {
  const typed = useTypedText(text);
  return (
    <p className="mt-3 whitespace-pre-wrap text-pretty text-[15px] leading-7">
      {typed.text}
      {(streaming || typed.typing) && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-foreground" />}
    </p>
  );
}

const PROVIDER_LABEL: Record<string, string> = { gemini: "Gemini", nvidia: "Nemotron", anthropic: "Claude" };

/** Case studies the model named, so its prose can be followed by real links. */
function mentionedProjects(text: string) {
  return projects.filter((project) => text.includes(project.title)).slice(0, 4);
}

/**
 * Owns the conversation and renders the side chat. It lives in the root layout, so
 * the conversation survives scrolling and moving between the homepage and case
 * studies — the point of a side chat is asking while you read, not instead of it.
 *
 * It asks the model endpoint first and streams the reply; where that endpoint does
 * not exist it answers from the in-browser retrieval instead. Either way every
 * answer is grounded in the site's own content, and each answer's badge says which
 * path produced it.
 */
export function AskProvider({ children }: { children: React.ReactNode }) {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const nextId = useRef(0);
  const abort = useRef<AbortController | null>(null);
  // Read inside submit without making submit change identity on every token.
  const exchangesRef = useRef(exchanges);
  exchangesRef.current = exchanges;
  const busyRef = useRef(false);

  useEffect(() => () => abort.current?.abort(), []);

  const submit = useCallback((value: string) => {
    const asked = value.trim();
    if (!asked) return;
    setOpen(true);
    if (busyRef.current) return;

    const id = nextId.current++;
    busyRef.current = true;
    setBusy(true);

    // Only model-answered exchanges are conversation history; a locally answered
    // one has no assistant text the model ever produced.
    const history: ChatTurn[] = exchangesRef.current
      .filter((exchange) => exchange.text)
      .flatMap((exchange) => [
        { role: "user" as const, content: exchange.question },
        { role: "assistant" as const, content: exchange.text },
      ]);

    setExchanges((current) => [...current, { id, question: asked, text: "", local: null, status: "thinking" }]);
    const patch = (update: Partial<Exchange>) =>
      setExchanges((current) => current.map((exchange) => (exchange.id === id ? { ...exchange, ...update } : exchange)));

    const controller = new AbortController();
    abort.current = controller;
    const startedAt = Date.now();
    void askRemote([...history, { role: "user", content: asked }], (text, meta) => patch({ text, provider: meta.provider, status: "streaming" }), controller.signal).then(
      async (result) => {
        // The local path is instant, which reads as a canned reply popping in. Hold
        // the "reading" state for a beat so both paths feel like the same assistant.
        if (result !== "answered") await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 480 - (Date.now() - startedAt))));
        // Cleared mid-answer: the exchange is gone and a new one may already be running.
        if (controller.signal.aborted) return;
        if (result === "answered") patch({ status: "done" });
        else patch({ local: ask(asked), limited: result === "limited", status: "done" });
        busyRef.current = false;
        setBusy(false);
      },
    );
  }, []);

  const clear = useCallback(() => {
    abort.current?.abort();
    busyRef.current = false;
    setBusy(false);
    setExchanges([]);
  }, []);

  const value = useMemo(() => ({ exchanges, busy, open, setOpen, submit, clear }), [exchanges, busy, open, submit, clear]);

  return (
    <AskContext.Provider value={value}>
      {children}
      <SideChat />
    </AskContext.Provider>
  );
}

function AskForm({
  inputRef,
  placeholder,
  onSubmitted,
}: {
  inputRef?: React.Ref<HTMLInputElement>;
  placeholder: string;
  onSubmitted?: () => void;
}) {
  const { busy, submit } = useAsk();
  const [question, setQuestion] = useState("");

  return (
    <form
      className="flex items-center gap-2.5"
      onSubmit={(event) => {
        event.preventDefault();
        if (!question.trim() || busy) return;
        submit(question);
        setQuestion("");
        onSubmitted?.();
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4 py-2.5 transition focus-within:border-foreground/25">
        <span aria-hidden="true" className="font-mono text-[13px] text-accent">
          ›
        </span>
        <input
          aria-label="Ask a question about Moin's work"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted focus-visible:outline-none"
          maxLength={600}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder={placeholder}
          ref={inputRef}
          value={question}
        />
      </div>
      <button className="btn-ink shrink-0 rounded-xl px-4 py-2.5 text-[13px] font-medium disabled:opacity-30" disabled={!question.trim() || busy} type="submit">
        Ask
      </button>
    </form>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24" width="18">
      <path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 17.5h-7.2L8 21v-3.5H4A1.5 1.5 0 0 1 2.5 16V7A1.5 1.5 0 0 1 4 5.5Z" />
      <path d="M7.5 10h9M7.5 13.5h5.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" viewBox="0 0 24 24" width="16">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function SideChat() {
  const { exchanges, busy, open, setOpen, submit, clear } = useAsk();
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // A new question goes to the top of the log, so its answer is read from the first
  // line down. Streaming tokens do not move it again — the reader controls the scroll.
  const count = exchanges.length;
  useEffect(() => {
    const log = logRef.current;
    const last = log?.querySelector<HTMLElement>("[data-exchange]:last-of-type");
    if (log && last) log.scrollTop = last.offsetTop - 20;
  }, [count, open]);

  // Focus follows the panel in, and goes back where it came from on the way out.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    };
  }, [open, setOpen]);

  return (
    <>
      {/* The only visible way into the chat, so it says what it is. Static, and in the
          corner rather than the dock: it must not compete with the mode switch. On a
          phone it drops to the icon so it cannot crowd the switch. On desktop the chat
          opens above it and the button stays put as the toggle; on a phone the sheet
          covers it, so it steps aside. */}
      <button
        aria-expanded={open}
        aria-label="Ask about Moin's work"
        className={cn(
          "btn-ink fixed bottom-3 right-3 z-40 flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[13px] font-medium ring-1 ring-background/20 sm:bottom-5 sm:right-6 sm:px-4",
          open && "max-sm:pointer-events-none max-sm:opacity-0",
        )}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask"}</span>
        {!open && exchanges.length > 0 && <span aria-hidden="true" className="absolute right-0.5 top-0.5 size-2.5 rounded-full border-2 border-foreground bg-accent" />}
      </button>

      {/* Phones only: the sheet covers the page, so it gets a scrim to tap out of. On
          desktop there is none on purpose — the page stays readable beside the chat. */}
      <div
        aria-hidden="true"
        className={cn("fixed inset-0 z-[59] bg-foreground/25 transition-opacity duration-300 sm:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
        onClick={() => setOpen(false)}
      />

      <aside
        aria-label="Ask about Moin's work"
        className="side-panel material fixed inset-x-0 bottom-0 z-[60] flex h-[86svh] flex-col rounded-t-[1.5rem] sm:inset-x-auto sm:bottom-[4.75rem] sm:right-6 sm:h-[min(42rem,calc(100svh-6rem))] sm:w-[26rem] sm:rounded-[1.5rem]"
        data-open={open}
        inert={!open}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
              <span aria-hidden="true" className={cn("size-1.5 rounded-full bg-accent", busy && "animate-pulse")} />
              Ask about Moin&rsquo;s work
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">answers only from this site</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {exchanges.length > 0 && (
              <button
                className="rounded-lg px-2.5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition hover:bg-surface-raised hover:text-foreground"
                onClick={clear}
                type="button"
              >
                Clear
              </button>
            )}
            <button
              aria-label="Close chat"
              className="grid size-9 place-items-center rounded-lg text-muted transition hover:bg-surface-raised hover:text-foreground"
              onClick={() => setOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div aria-live="polite" className="relative min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 py-5" ref={logRef}>
          {exchanges.length === 0 && (
            <div>
              <p className="text-pretty text-[15px] leading-7 text-muted">
                Ask anything about the projects, the Amazon internship, the research, or the stack. Keep reading the page while you do — this stays
                open beside it.
              </p>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Try asking</p>
              <div className="mt-3 grid gap-2">
                {suggestedQuestions.slice(0, 5).map((suggestion) => (
                  <button
                    className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-[14px] transition hover:border-foreground/20"
                    key={suggestion.id}
                    onClick={() => submit(suggestion.question)}
                    type="button"
                  >
                    {suggestion.question}
                    <span aria-hidden="true" className="nudge text-muted">
                      ↗
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {exchanges.map((exchange) => {
            const cited = mentionedProjects(exchange.text);
            return (
              <div data-exchange key={exchange.id}>
                <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-[14.5px] leading-6 text-background">
                  {exchange.question}
                </p>

                {exchange.local ? (
                  <>
                    {exchange.limited && (
                      <p className="mt-4 rounded-xl border border-border bg-background px-3.5 py-2.5 text-[13px] leading-5 text-muted">
                        Today&rsquo;s AI answers are used up, so this one comes straight from the site&rsquo;s own index. For anything it
                        can&rsquo;t answer, email <a className="font-medium text-foreground underline-offset-2 hover:underline" href="mailto:hello@moinuddin.app">hello@moinuddin.app</a>.
                      </p>
                    )}
                    <AnswerPanel answer={exchange.local} className="mt-4" stream />
                  </>
                ) : (
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      <span className={cn("size-1.5 rounded-full bg-accent", exchange.status !== "done" && "animate-pulse")} />
                      {exchange.status === "thinking" ? "Reading the portfolio" : `${PROVIDER_LABEL[exchange.provider ?? ""] ?? "Model"} · grounded in this site`}
                    </span>
                    {exchange.text && <TypedAnswer streaming={exchange.status === "streaming"} text={exchange.text} />}
                    {exchange.status === "done" && cited.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {cited.map((project) => (
                          <Link
                            className="rounded-full border border-border bg-background px-3 py-1.5 text-[13px] font-medium transition hover:border-foreground/20"
                            href={`/work/${project.slug}`}
                            key={project.slug}
                          >
                            {project.title} ↗
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-border p-4">
          <AskForm inputRef={inputRef} placeholder={exchanges.length ? "Ask a follow-up…" : "Ask a question…"} />
        </div>
      </aside>
    </>
  );
}
