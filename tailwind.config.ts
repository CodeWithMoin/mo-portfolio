import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-raised": "var(--surface-raised)",
        muted: "var(--muted)",
        "muted-strong": "var(--muted-strong)",
        border: "var(--border)",
        accent: "var(--accent)",
        status: "var(--status)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Geist", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      maxWidth: {
        site: "1180px",
      },
      boxShadow: {
        card: "var(--card-shadow)",
        nav: "var(--nav-shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
