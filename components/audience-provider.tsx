"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { DEFAULT_AUDIENCE, QUERY_KEY, STORAGE_KEY, normalizeAudience, type Audience } from "@/lib/audience";

type AudienceContextValue = {
  audience: Audience;
  setAudience: (next: Audience) => void;
  /** False until the client has reconciled URL/localStorage, so UI can avoid a flash of the wrong label. */
  ready: boolean;
};

const AudienceContext = createContext<AudienceContextValue | null>(null);

/** Mirrors the pre-paint inline script in app/layout.tsx. Keep the two in sync. */
function resolveInitialAudience(): Audience {
  if (typeof document === "undefined") return DEFAULT_AUDIENCE;

  const fromUrl = normalizeAudience(new URLSearchParams(window.location.search).get(QUERY_KEY));
  if (fromUrl) return fromUrl;

  try {
    const stored = normalizeAudience(window.localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;
  } catch {
    // Private browsing and blocked storage both throw here; the default is fine.
  }

  return DEFAULT_AUDIENCE;
}

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>(DEFAULT_AUDIENCE);
  const [ready, setReady] = useState(false);

  // Runs after hydration so server and client first render agree on the default.
  useEffect(() => {
    setAudienceState(resolveInitialAudience());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.audience = audience;
  }, [audience]);

  /**
   * Sections are positioned with CSS `order`, which the browser applies only after
   * hydration — so a deep link like /#lab first resolves against the unordered
   * document and lands on the wrong offset. Re-run the jump once order is settled.
   */
  useEffect(() => {
    if (!ready) return;

    const id = window.location.hash.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    const frame = requestAnimationFrame(() => {
      target.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const setAudience = useCallback((next: Audience) => {
    const root = document.documentElement;
    if (root.dataset.audience === next && !root.dataset.switching) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference just will not persist; the switch still works this session.
    }
    // Keep the URL shareable without adding a history entry per toggle.
    const url = new URL(window.location.href);
    url.searchParams.set(QUERY_KEY, next);
    window.history.replaceState(null, "", url);

    /**
     * The reorder rewrites the whole document, so doing it in plain sight swaps the
     * content under the reader's eyes. Instead: fade the section flow out, swap
     * while nothing is visible, put the reader back on the section they were in,
     * then fade in. The anchor matters as much as the fade — without it the page
     * keeps its scroll offset and lands on an unrelated section.
     */
    // Anchor to whichever section fills most of the viewport. A fixed probe line
    // picks the wrong one whenever a heading sits just below it — the reader is
    // looking at the section that dominates the screen, not the one grazing a line.
    const candidates = [...document.querySelectorAll<HTMLElement>("[data-section], #contact")];
    let current: HTMLElement | undefined;
    let mostVisible = 0;
    for (const element of candidates) {
      if (element.offsetHeight === 0) continue;
      const rect = element.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visible > mostVisible) {
        mostVisible = visible;
        current = element;
      }
    }
    // While the hero still holds most of the screen, nothing above the fold moves.
    const hero = document.getElementById("top")?.getBoundingClientRect();
    if (hero && Math.min(hero.bottom, window.innerHeight) - Math.max(hero.top, 0) > mostVisible) current = undefined;
    const anchor = current ? { element: current, offset: current.getBoundingClientRect().top } : null;

    const apply = () => {
      root.dataset.audience = next;
      // Commit React's side of the change now. Selected Work swaps its projects on
      // this state, which changes its height; measuring before that commit restored
      // the scroll against a layout that was about to move.
      flushSync(() => setAudienceState(next));

      if (!anchor) return; // In the hero: nothing above it moves, so leave scroll alone.
      const target = anchor.element.offsetHeight > 0 ? anchor.element : document.getElementById("work");
      if (!target) return;
      const offset = anchor.element.offsetHeight > 0 ? anchor.offset : 96;
      window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset, behavior: "instant" });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    root.dataset.switching = "true";
    window.setTimeout(() => {
      apply();
      // Timers, not rAF: a throttled tab would otherwise leave the page faded out.
      window.setTimeout(() => delete root.dataset.switching, 60);
    }, 190);
  }, []);

  return (
    <AudienceContext.Provider value={{ audience, setAudience, ready }}>
      {/*
        The reduced-motion block in globals.css only reaches CSS transitions and
        animations. Framer drives its own values on every frame, so it ignores that
        entirely — every AnimatePresence crossfade and spring on this site would keep
        moving for someone who asked the OS for less motion. `reducedMotion="user"`
        makes the whole tree honour the setting in one place, instead of each
        component remembering to call useReducedMotion.
      */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (!context) throw new Error("useAudience must be used inside an AudienceProvider");
  return context;
}
