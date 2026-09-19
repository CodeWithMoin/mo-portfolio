import { cn } from "@/lib/cn";

/**
 * Editorial section opener: a full-width rule, then the title on the left and its
 * description on the right.
 *
 * The rule is the boundary — without it, sections on a one-colour page run into each
 * other. The split uses the measure properly: a heading and its description stacked
 * in one narrow left column left half the page empty and wrapped both awkwardly.
 *
 * The index is not passed in. Sections reorder per audience, so the number comes
 * from a `--section-index` custom property that the generated stylesheet in
 * app/layout.tsx sets per audience — correct before hydration, never stale.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 border-t border-foreground/15 pt-5 md:mb-14", className)}>
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span aria-hidden="true" className="section-index text-accent" />
        {eyebrow}
      </p>
      <div className="mt-7 grid gap-x-14 gap-y-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
        <h2 className="max-w-[22ch] text-balance text-3xl font-bold tracking-[-0.04em] sm:text-[2.6rem] sm:leading-[1.08]">
          {title}
        </h2>
        {description && <p className="max-w-[52ch] text-pretty text-base leading-7 text-muted sm:text-[17px] lg:pb-1.5">{description}</p>}
      </div>
    </div>
  );
}
