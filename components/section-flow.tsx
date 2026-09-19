"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useAudience } from "@/components/audience-provider";
import { sectionOrder } from "@/lib/audience";
import { cn } from "@/lib/cn";

/**
 * Flex column whose children reorder via CSS `order`, so switching audience never
 * unmounts or remounts a section — no re-fetch, no lost scroll, no animation replay.
 */
export function SectionFlow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("section-flow flex flex-col", className)}>{children}</div>;
}

/**
 * One reorderable section.
 *
 * Layout — which sections show, and in what order — is owned entirely by the
 * generated stylesheet in app/layout.tsx, keyed off `data-audience` on <html>. That
 * makes the order correct before React hydrates, so a `?v=founder` link does not
 * render the recruiter layout first and then rearrange itself.
 *
 * This component only adds the motion: on a switch, each section replays a short
 * staggered settle in its new position so the change reads as the page
 * reconfiguring rather than a flicker.
 */
export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { audience } = useAudience();
  const controls = useAnimationControls();
  const reduceMotion = useReducedMotion();
  const isFirstRun = useRef(true);

  const position = sectionOrder[audience].indexOf(id);

  useEffect(() => {
    // Skip the initial mount: the page should not animate itself on arrival.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (reduceMotion || position === -1) return;

    // Opacity is the curtain's job (see globals.css); this only adds the staggered
    // rise, timed to land as the curtain lifts.
    controls.start({
      y: [18, 0],
      transition: { duration: 0.55, delay: 0.05 + Math.min(position * 0.04, 0.24), ease: [0.22, 1, 0.36, 1] },
    });
  }, [audience, controls, position, reduceMotion]);

  return (
    <motion.section animate={controls} className={className} data-section={id} id={id}>
      {children}
    </motion.section>
  );
}
