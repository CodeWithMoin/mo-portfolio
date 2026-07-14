import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["Work", "/#work"],
  ["Research", "/#research"],
  ["Experience", "/#experience"],
  ["Writing", "/#writing"],
];

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-14 max-w-[1180px] items-center justify-between rounded-full border border-border/90 bg-background/95 px-4 shadow-nav backdrop-blur-xl sm:px-5"
      >
        <Link className="flex items-center gap-3 text-sm font-semibold tracking-[-0.01em]" href="/">
          <span className="grid size-7 place-items-center rounded-full bg-foreground text-[10px] font-bold text-background">MS</span>
          <span className="hidden sm:block">Moinuddin Shaik</span>
        </Link>
        {!compact && (
          <div className="hidden items-center gap-6 text-sm text-muted md:flex">
            {links.map(([label, href]) => (
              <Link className="transition hover:text-foreground" href={href} key={href}>
                {label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <a
            className="hidden rounded-full px-3 py-2 text-sm text-muted transition hover:text-foreground sm:block"
            href="/Moinuddin_Shaik_Resume.pdf"
            target="_blank"
          >
            Résumé
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
