import Link from "next/link";
import { projects } from "@/lib/portfolio-data";
import { profile } from "@/lib/profile";

export const metadata = { title: "Not found" };

/**
 * A dead link should not be a dead end. The three most substantial case studies are
 * offered here directly, so a stale URL still lands somewhere worth reading.
 */
const suggestions = ["amazon-applied-science", "markalign", "decode"]
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is NonNullable<typeof project> => Boolean(project));

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-screen max-w-2xl place-items-center px-5 py-24">
      <div className="w-full">
        <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent shadow-[0_1px_2px_rgba(13,13,12,0.05)]">
          404 · route not found
        </span>
        <h1 className="mt-7 text-balance text-5xl font-bold tracking-[-0.045em] sm:text-6xl">This path does not resolve.</h1>
        <p className="mt-5 text-lg leading-8 text-muted">
          The portfolio is still here — only the requested route is missing. These are the three worth reading first.
        </p>

        <ul className="mt-9 divide-y divide-border border-y border-border">
          {suggestions.map((project) => (
            <li key={project.slug}>
              <Link className="group flex items-baseline justify-between gap-5 py-4" href={`/work/${project.slug}`}>
                <span>
                  <span className="text-lg font-semibold tracking-[-0.03em] transition group-hover:text-accent">
                    {project.title}
                  </span>
                  <span className="mt-1 block max-w-md text-[14px] leading-6 text-muted">{project.eyebrow}</span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-muted transition group-hover:text-accent">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex min-h-11 items-center rounded-full border border-foreground bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
            href="/"
          >
            Back to the start
          </Link>
          <a
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-5 text-sm font-medium transition hover:border-foreground/25"
            href={profile.links.email}
          >
            {profile.email}
          </a>
        </div>
      </div>
    </main>
  );
}
