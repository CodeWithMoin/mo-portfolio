import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">404 · Signal not found</p>
        <h1 className="mt-6 text-5xl font-medium tracking-[-0.055em] sm:text-7xl">This path does not resolve.</h1>
        <p className="mt-6 text-lg leading-8 text-muted">The portfolio is still here. The requested route is not.</p>
        <Link className="mt-8 inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background" href="/">Return home</Link>
      </div>
    </main>
  );
}
