import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className, href, variant = "primary", ...props }: ButtonProps) {
  const styles = {
    primary: "border-foreground bg-foreground text-background hover:opacity-90",
    secondary: "border-border bg-surface text-foreground hover:border-foreground/25 hover:bg-surface-raised",
    ghost: "border-transparent bg-transparent text-muted hover:text-foreground",
  };

  const classes = cn(
    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-5 text-sm font-medium transition duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    styles[variant],
    className,
  );

  if (href.startsWith("/")) {
    return (
      <Link className={classes} href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a className={classes} href={href} rel={href.startsWith("http") ? "noreferrer" : undefined} target={href.startsWith("http") ? "_blank" : undefined} {...props}>
      {children}
    </a>
  );
}
