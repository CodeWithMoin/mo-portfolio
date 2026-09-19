"use client";

import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * useLayoutEffect warns when React renders on the server, where it is a no-op.
 * The measurement genuinely needs to run before paint on the client, so pick the
 * right hook per environment instead of downgrading it everywhere.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
import { useAudience } from "@/components/audience-provider";
import { AUDIENCES, audienceLabels } from "@/lib/audience";
import { cn } from "@/lib/cn";

/**
 * Two-state segmented control. The active pill travels on a spring and stretches
 * along the way — scaleX is driven by the pill's own velocity, so the squash is a
 * consequence of the motion rather than a fixed keyframe, and it settles back to
 * rest shape on its own. Labels stay visible: an unlabelled toggle would not say
 * what it switches between.
 */
export function AudienceSwitch({ className }: { className?: string }) {
  const { audience, setAudience, ready } = useAudience();
  const reduceMotion = useReducedMotion();
  const activeIndex = AUDIENCES.indexOf(audience);

  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  // The pill travels one segment width; measure it rather than assuming, so the
  // control can sit in a fixed-width header slot or stretch to full width on mobile.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Travel is one thumb-width, which excludes the track's padding. Dividing the
    // full clientWidth (padding included) overshot by half the padding, so the thumb
    // ran into the track's right edge in the last position.
    const measure = () => {
      const style = getComputedStyle(track);
      const inner = track.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      setStep(inner / AUDIENCES.length);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const smoothVelocity = useSpring(velocity, { stiffness: 500, damping: 50, restDelta: 1 });

  // Peak stretch lands around the fastest part of the travel and relaxes as it settles.
  const scaleX = useTransform(smoothVelocity, [-1400, 0, 1400], [1.22, 1, 1.22], { clamp: true });

  useEffect(() => {
    if (step === 0) return;

    const target = activeIndex * step;
    if (!ready || reduceMotion) {
      x.set(target);
      return;
    }

    // Slight overshoot is deliberate: the overshoot is what drives the stretch.
    const animation = animate(x, target, { type: "spring", stiffness: 420, damping: 26, mass: 0.9 });
    return () => animation.stop();
  }, [activeIndex, step, ready, reduceMotion, x]);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        aria-label="Choose what this page leads with"
        className="relative inline-grid grid-cols-2 overflow-hidden rounded-full bg-foreground p-1 shadow-[0_8px_28px_rgba(13,13,12,0.2)] ring-1 ring-background/20"
        ref={trackRef}
        role="radiogroup"
      >
        <motion.span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full bg-background"
        style={{
          width: `calc((100% - 0.5rem) / ${AUDIENCES.length})`,
          x,
          scaleX: reduceMotion ? 1 : scaleX,
        }}
      />
      {AUDIENCES.map((option) => {
        const active = option === audience;
        return (
          <button
            aria-checked={active}
            className={cn(
              "relative z-10 whitespace-nowrap rounded-full px-2.5 py-2 text-[13px] sm:px-4 font-medium tracking-[-0.01em] transition-colors duration-300 focus-visible:outline-offset-[-3px]",
              active ? "text-foreground" : "text-background/60 hover:text-background",
            )}
            key={option}
            onClick={() => setAudience(option)}
            role="radio"
            title={audienceLabels[option].hint}
            type="button"
          >
            {audienceLabels[option].label}
          </button>
        );
      })}
      </div>
    </div>
  );
}
