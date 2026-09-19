import type { Config } from "tailwindcss";

const withAlpha = (variable: string) => `color-mix(in srgb, var(${variable}) calc(<alpha-value> * 100%), transparent)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Theme colours are CSS variables. Declared as a bare `var(--x)`, Tailwind
      // cannot apply an opacity modifier, so every `text-foreground/70` or
      // `hover:border-foreground/20` compiled to nothing — silently. Routing them
      // through color-mix gives Tailwind an <alpha-value> slot while the variables
      // in globals.css stay plain colours that the rest of the CSS can keep using.
      colors: {
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),
        surface: withAlpha("--surface"),
        "surface-raised": withAlpha("--surface-raised"),
        muted: withAlpha("--muted"),
        "muted-strong": withAlpha("--muted-strong"),
        border: withAlpha("--border"),
        accent: withAlpha("--accent"),
        status: withAlpha("--status"),
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
