import type { Metadata, Viewport } from "next";
import { AskProvider } from "@/components/ask-chat";
import { AudienceProvider } from "@/components/audience-provider";
import { AUDIENCES, sectionOrder } from "@/lib/audience";
import { profile, roles } from "@/lib/profile";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moinuddin.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moinuddin Shaik · AI Engineer & Applied Scientist",
    template: "%s · Moinuddin Shaik",
  },
  description:
    "AI engineer and applied scientist. Applied Scientist Intern at Amazon RBS Sciences, first author on a submitted AMLC paper, and nine systems written up end to end — retrieval, evaluation, multi-agent, and durable backends. The site adapts to whether you are hiring or building.",
  keywords: [
    "Moinuddin Shaik",
    "Applied Scientist",
    "AI Systems Engineer",
    "Amazon Applied Scientist Intern",
    "LLM Evaluation",
    "Retrieval-Augmented Generation",
    "Machine Learning Infrastructure",
    "Agentic RAG",
    "Durable Execution",
    "Multi-agent Systems",
  ],
  authors: [{ name: "Moinuddin Shaik" }],
  creator: "Moinuddin Shaik",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Moinuddin Shaik · AI Engineer & Applied Scientist",
    description: "AI engineer and applied scientist. Amazon RBS Sciences, first-author research, and nine systems written up with the numbers attached.",
    siteName: "Moinuddin Shaik",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moinuddin Shaik · AI Engineer & Applied Scientist",
    description: "AI engineer and applied scientist. Amazon RBS Sciences, first-author research, and nine systems written up with the numbers attached.",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f4f3",
  width: "device-width",
  initialScale: 1,
};

/**
 * Section order as CSS, generated from the same `sectionOrder` the components read.
 *
 * Computing order in React means a visitor arriving on `?v=founder` gets the
 * recruiter layout until hydration finishes, then watches the whole page reorder.
 * The pre-paint script sets `data-audience` on <html> before first paint, so keying
 * off that attribute makes the layout correct immediately — no reflow, and no second
 * source of truth, because this string is derived from the TypeScript.
 */
const sectionOrderCss = [
  "[data-section]{display:none}",
  ...AUDIENCES.flatMap((audience) =>
    sectionOrder[audience].map(
      (id, position) =>
        `html[data-audience="${audience}"] [data-section="${id}"]{display:block;order:${position};--section-index:"${String(position + 1).padStart(2, "0")}"}`,
    ),
  ),
].join("");

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the pre-paint script below rewrites data-audience
    // before React hydrates, on purpose, so the server and client values disagree
    // for any ?v=founder visitor. It applies to this element's own attributes only —
    // mismatches anywhere inside the tree are still reported.
    <html data-audience="recruiter" lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html: sectionOrderCss }} />
        {/*
          Sets the audience attribute before first paint so a visitor whose stored
          preference is "startup" never sees the recruiter order flash first.
          Mirrors resolveInitialAudience() in components/audience-provider.tsx.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var n=function(v){return v==="founder"||v==="recruiter"?v:v==="startup"?"founder":null};var a=n(new URLSearchParams(location.search).get("v"))||n(localStorage.getItem("portfolio-audience"))||"recruiter";document.documentElement.dataset.audience=a}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {/* Person schema so search and AI crawlers get the same facts the page
            states, rather than inferring them from prose. */}
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: profile.name,
              jobTitle: profile.role,
              description: profile.tagline,
              email: profile.email,
              url: siteUrl,
              address: { "@type": "PostalAddress", addressLocality: profile.location.city, addressCountry: profile.location.country },
              alumniOf: { "@type": "EducationalOrganization", name: profile.education.degree },
              knowsAbout: profile.focus,
              sameAs: [profile.links.github, profile.links.linkedin],
              worksFor: roles.map((role) => ({ "@type": "Organization", name: `${role.company} · ${role.org}` })),
            }),
          }}
          type="application/ld+json"
        />
        {/* First tab stop: a long single-page site is punishing for keyboard and
            screen-reader users without a way past the nav. */}
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:border focus:border-border focus:bg-surface focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:shadow-nav"
          href="#work"
        >
          Skip to content
        </a>
        <div aria-hidden="true" className="grain-overlay" />
        <AudienceProvider>
          <AskProvider>{children}</AskProvider>
        </AudienceProvider>
      </body>
    </html>
  );
}
