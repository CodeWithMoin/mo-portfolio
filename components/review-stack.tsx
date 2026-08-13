"use client";

import { motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type StackCard = { id: string; content: ReactNode };

const spring = { type: "spring", stiffness: 220, damping: 26 } as const;

function StackedCard({
  children,
  depth,
  total,
  draggable,
  sensitivity,
  onDismiss,
}: {
  children: ReactNode;
  depth: number;
  total: number;
  draggable: boolean;
  sensitivity: number;
  onDismiss: () => void;
}) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  // Gentle tilt — these cards are wide, so the reference's ±60deg reads as broken.
  const rotateX = useTransform(dragY, [-120, 120], [8, -8]);
  const rotateY = useTransform(dragX, [-120, 120], [-8, 8]);

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onDismiss();
    }
    dragX.set(0);
    dragY.set(0);
  }

  // Clamp the visible fan so a deep stack doesn't splay off the container.
  const fan = Math.min(depth, 3);

  return (
    <motion.div
      animate={{ rotateZ: fan * 2.4, scale: 1 - fan * 0.05, y: fan * 16, opacity: depth > 3 ? 0 : 1 }}
      className="absolute inset-0"
      initial={false}
      style={{ transformOrigin: "50% 100%", zIndex: total - depth }}
      transition={spring}
    >
      <motion.div
        className={cn("size-full", draggable ? "cursor-grab active:cursor-grabbing" : "pointer-events-none")}
        drag={draggable}
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        style={{ x: dragX, y: dragY, rotateX, rotateY }}
      >
        <div className="size-full overflow-hidden rounded-[1.25rem] border border-border bg-white shadow-card">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function ReviewStack({
  cards,
  sensitivity = 140,
  autoplayDelay = 4200,
  className,
}: {
  cards: StackCard[];
  sensitivity?: number;
  autoplayDelay?: number;
  className?: string;
}) {
  const total = cards.length;
  // DOM order stays fixed and only `topIndex` moves. Reordering keyed children
  // instead leaves Framer animating stale per-element targets.
  const [topIndex, setTopIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  const advance = useCallback(() => setTopIndex((current) => (current + 1) % total), [total]);

  useEffect(() => {
    if (reduceMotion || paused || total < 2) return;
    const timer = window.setInterval(advance, autoplayDelay);
    return () => window.clearInterval(timer);
  }, [advance, autoplayDelay, paused, reduceMotion, total]);

  return (
    <div className={className}>
      <div
        className="relative [perspective:1200px]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ aspectRatio: "1450 / 630" }}
      >
        {cards.map((card, index) => {
          const depth = (index - topIndex + total) % total;
          return (
            <StackedCard
              depth={depth}
              draggable={!reduceMotion && depth === 0}
              key={card.id}
              onDismiss={advance}
              sensitivity={sensitivity}
              total={total}
            >
              {card.content}
            </StackedCard>
          );
        })}
      </div>

      {/* Fanned cards translate up to ~48px below this container via transform, which
          doesn't add to layout height (transforms are visual-only). mt-7 alone left the
          deck overlapping this row; mt-20 reserves real space for the worst-case fan. */}
      <div className="mt-24 flex flex-wrap items-center gap-4">
        <button
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-4 text-sm font-medium transition duration-200 active:scale-[0.97] hover:border-foreground/25"
          onClick={advance}
          type="button"
        >
          Next review <span aria-hidden="true">→</span>
        </button>
        <div aria-label="Choose a review" className="flex items-center gap-2" role="tablist">
          {cards.map((card, index) => (
            <button
              aria-label={`Show review ${index + 1} of ${total}`}
              aria-selected={index === topIndex}
              className={cn(
                "size-2 rounded-full transition",
                index === topIndex ? "bg-foreground" : "bg-border hover:bg-muted-strong",
              )}
              key={card.id}
              onClick={() => setTopIndex(index)}
              role="tab"
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
