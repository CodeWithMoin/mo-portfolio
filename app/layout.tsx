import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://moinuddin.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moinuddin Shaik · I build things",
    template: "%s · Moinuddin Shaik",
  },
  description:
    "AI systems, most recently at Amazon. Before that, video work for 200+ clients from age 15, and a Student Nationals silver in badminton. First-author research, production LLM systems, and the proof behind each.",
  keywords: [
    "Moinuddin Shaik",
    "Applied Scientist",
    "AI Systems Engineer",
    "Amazon Applied Scientist Intern",
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
    title: "Moinuddin Shaik · I build things",
    description:
      "AI systems, most recently at Amazon. Before that, video work for 200+ clients from age 15, and a Student Nationals silver.",
    siteName: "Moinuddin Shaik",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Moinuddin Shaik · I build AI systems, most recently at Amazon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moinuddin Shaik · I build things",
    description: "AI systems, most recently at Amazon. Before that, video work for 200+ clients from age 15, and a Student Nationals silver.",
    images: ["/og.png"],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f4f4f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div aria-hidden="true" className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
