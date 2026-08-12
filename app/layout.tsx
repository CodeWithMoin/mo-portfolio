import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://smoin.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moinuddin Shaik · Applied Scientist & AI Systems Engineer",
    template: "%s · Moinuddin Shaik",
  },
  description:
    "Applied Scientist and AI Systems Engineer building reliable retrieval, evaluation, ML infrastructure, and on-device AI systems.",
  keywords: [
    "Moinuddin Shaik",
    "Applied Scientist",
    "AI Systems Engineer",
    "LLM Evaluation",
    "Retrieval-Augmented Generation",
    "Machine Learning Infrastructure",
  ],
  authors: [{ name: "Moinuddin Shaik" }],
  creator: "Moinuddin Shaik",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Moinuddin Shaik · Building reliable AI systems",
    description:
      "Applied Scientist designing retrieval, evaluation, and ML infrastructure for real-world AI systems.",
    siteName: "Moinuddin Shaik",
  },
  twitter: {
    card: "summary",
    title: "Moinuddin Shaik · Building reliable AI systems",
    description: "Applied Scientist and AI Systems Engineer working across retrieval, evaluation, and ML infrastructure.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `
  try {
    const stored = localStorage.getItem('theme');
    const dark = stored ? stored === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  } catch (_) {
    document.documentElement.classList.add('dark');
  }
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
