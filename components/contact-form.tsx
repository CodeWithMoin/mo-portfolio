"use client";

import { useRef, useState } from "react";
import { profile } from "@/lib/profile";
import { cn } from "@/lib/cn";

type State = "idle" | "sending" | "sent" | "error";

const ERRORS: Record<string, string> = {
  invalid_name: "Add your name.",
  invalid_email: "That email doesn't look right.",
  invalid_message: "Write a little more — at least a sentence.",
  rate_limited: "That's a few messages today already. Email is quicker from here.",
};

/**
 * A short form on the dark closing panel, sent through /api/contact. When the
 * endpoint is not configured or fails, it says so and offers the address instead —
 * a message is never silently lost.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const openedAt = useRef(Date.now());

  const field =
    "w-full rounded-xl border border-background/15 bg-background/[0.06] px-4 py-3 text-[15px] text-background outline-none transition placeholder:text-background/40 focus:border-background/45 focus-visible:outline-none";

  if (state === "sent") {
    return (
      <div className="flex h-full min-h-[16rem] flex-col justify-center rounded-2xl border border-background/15 bg-background/[0.04] p-7" role="status">
        <p className="text-2xl font-bold tracking-[-0.03em]">Sent. Thank you.</p>
        <p className="mt-3 text-[15px] leading-7 text-background/65">It&rsquo;s in Moin&rsquo;s inbox with your address on it, so a reply comes straight to you.</p>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setState("sending");
        setError("");
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: data.get("name"),
              email: data.get("email"),
              message: data.get("message"),
              company: data.get("company"),
              elapsed: Date.now() - openedAt.current,
            }),
          });
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          if (response.ok) return setState("sent");
          setError(ERRORS[body.error ?? ""] ?? `The form couldn't send just now — email ${profile.email} instead.`);
        } catch {
          setError(`The form couldn't send just now — email ${profile.email} instead.`);
        }
        setState("error");
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/55">Name</span>
          <input autoComplete="name" className={field} maxLength={100} name="name" required />
        </label>
        <label className="grid gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/55">Email</span>
          <input autoComplete="email" className={field} maxLength={200} name="email" required type="email" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-background/55">Message</span>
        <textarea className={cn(field, "min-h-[7.5rem] resize-y leading-6")} maxLength={4000} minLength={10} name="message" placeholder="The role, the problem, or just hello." required />
      </label>
      {/* Honeypot: off-screen, out of the tab order and the accessibility tree. */}
      <input aria-hidden="true" autoComplete="off" className="absolute -left-[9999px] size-px opacity-0" name="company" tabIndex={-1} />

      <div className="mt-1 flex flex-wrap items-center gap-4">
        <button className="btn-paper inline-flex min-h-[3rem] items-center gap-2 rounded-full px-6 text-[15px] font-medium disabled:opacity-60" disabled={state === "sending"} type="submit">
          {state === "sending" ? "Sending…" : "Send message"} <span aria-hidden="true" className="nudge">↗</span>
        </button>
        {error && (
          <p className="text-[14px] text-background/75" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
