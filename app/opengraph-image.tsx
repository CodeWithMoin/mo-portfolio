import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { profile, roles } from "@/lib/profile";
import { publications } from "@/lib/portfolio-data";

// `output: export` requires metadata image routes to opt into static generation.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}`;

/**
 * The share card, generated from the same data the page renders.
 *
 * The previous og.png was hand-made and had drifted: it led with video clients and a
 * badminton medal while the site led with F1 scores. Deriving it here means the
 * preview cannot fall out of step with the work again.
 *
 * Satori cannot read WOFF2, so this uses TrueType builds of Geist in assets/fonts,
 * read at build time — the site itself still serves the WOFF2 from public/fonts.
 */
const font = (weight: 400 | 700) => readFileSync(join(process.cwd(), "assets", "fonts", `geist-${weight}.ttf`));

const amazon = roles.find((role) => role.id === "amazon")!;

export default async function Image() {
  const stats = [
    { value: amazon.outcomes[0].value, label: "taxonomy F1, vs a 0.71 manual baseline" },
    { value: amazon.outcomes[1].value, label: "autonomous run, was five to seven days" },
    { value: "First author", label: `${publications[0].venue}, ${publications[0].status}` },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f4f3",
          color: "#0d0d0c",
          padding: "68px 76px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5a1f" }} />
          <div style={{ fontSize: 22, letterSpacing: 2, color: "#6b6862" }}>
            {`${profile.name} · ${profile.role} · ${profile.location.city}`.toUpperCase()}
          </div>
        </div>

        {/* Three lines at 70px: two lines overflowed 1200px, and Satori collapses a
            &nbsp; between spans, so the gap is a margin rather than whitespace. */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 700, letterSpacing: -3, lineHeight: 1.08 }}>
            I build AI systems,
          </div>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 700, letterSpacing: -3, lineHeight: 1.08 }}>
            <span style={{ marginRight: 20 }}>and the</span>
            <span style={{ color: "#ff5a1f" }}>evaluation</span>
          </div>
          <div style={{ display: "flex", fontSize: 70, fontWeight: 700, letterSpacing: -3, lineHeight: 1.08 }}>
            that proves they work.
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid rgba(13,13,12,0.12)", paddingTop: 26 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column", width: 348, paddingRight: 28 }}>
              <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1.6 }}>{stat.value}</div>
              <div style={{ fontSize: 19, color: "#6b6862", marginTop: 8, lineHeight: 1.35 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, color: "#6b6862" }}>
          <div>{`Open to ${profile.openTo}`}</div>
          <div>moinuddin.app</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: font(400), weight: 400, style: "normal" },
        { name: "Geist", data: font(700), weight: 700, style: "normal" },
      ],
    },
  );
}
