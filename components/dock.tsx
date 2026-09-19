"use client";

import { useEffect, useState } from "react";
import { AudienceSwitch } from "@/components/audience-switch";
import { cn } from "@/lib/cn";


/**
 * The persistent dock: the mode switch, and nothing else.
 *
 * Contact actions deliberately do not live here — the hero card, the header, and the
 * closing panel already carry them, and a fourth copy floating over the content was
 * noise. Asking lives in the hero's chat (and behind ⌘K), not here. The switch is
 * solid, always present, and never animates after first paint — no translucent
 * wrapper, which read as a template's floating glass pill.
 */
export function Dock() {
  const [mounted, setMounted] = useState(false);
  const [overDark, setOverDark] = useState(false);

  // Eases in once, just after paint, so it does not compete with the hero landing.
  // After that it never moves: a dock that rearranges itself as you scroll is noise.
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // The fade is page-coloured, built for light content sliding under the dock. Over
  // the dark closing panel it turns into a grey smear, so it retires as soon as that
  // panel enters the viewport.
  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const observer = new IntersectionObserver(([entry]) => setOverDark(entry.isIntersecting));
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Same trick the header uses at the top: the pills float with nothing behind
          them, so text scrolling underneath collided with them. Content now dissolves
          into the page colour before it reaches the dock. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-30 veil-bottom h-24 transition-opacity duration-300 sm:h-28",
          overDark && "opacity-0",
        )}
      />

      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 transition duration-500 sm:pb-5",
          mounted ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        )}
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-1.5 sm:gap-2.5">
          <AudienceSwitch />
        </div>
      </div>
    </>
  );
}
