import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-xl text-center">
        <span className="inline-flex rounded-full border border-border bg-white px-3.5 py-1.5 text-[13px] font-medium text-accent shadow-[0_1px_2px_rgba(13,13,12,0.05)]">404 · Signal not found</span>
        <h1 className="mt-6 text-5xl font-medium tracking-[-0.02em] sm:text-7xl">This path does not resolve.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">The portfolio is still here. The requested route is not.</p>
        <Link className="mt-8 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background" href="/">Return home</Link>
      </div>
    </main>
  );
}
