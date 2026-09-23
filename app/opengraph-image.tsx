import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { profile, roles } from "@/lib/profile";
import { publications } from "@/lib/portfolio-data";

// `output: export` requires metadata image routes to opt into static generation.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${profile.name} — ${profile.role}. I build AI systems, and the evaluation that proves they work.`;

/**
 * The share card, generated from the same data the page renders, and drawn to look
 * like the page: the warm light and dot grid behind the hero, the headline, and the
 * snapshot card with the photo. A link preview is often the first thing someone sees
 * of the site, so it should read as the same object, not a slide about it.
 *
 * Satori cannot read WOFF2, so this uses TrueType builds of Geist in assets/fonts,
 * read at build time — the site itself still serves the WOFF2 from public/fonts.
 */
const read = (...path: string[]) => readFileSync(join(process.cwd(), ...path));
const font = (weight: 400 | 700) => read("assets", "fonts", `geist-${weight}.ttf`);
const photo = `data:image/jpeg;base64,${read("public", "moinuddin.jpg").toString("base64")}`;

const INK = "#0d0d0c";
const MUTED = "#6b6862";
const ACCENT = "#ff5a1f";
const RULE = "rgba(13,13,12,0.09)";

const amazon = roles.find((role) => role.id === "amazon")!;

export default async function Image() {
  const stats = [
    { value: amazon.outcomes[0].value, label: "taxonomy F1, vs 0.71 manual" },
    { value: amazon.outcomes[1].value, label: "down from 5–7 days" },
    { value: "1st author", label: `${publications[0].venue.split(" · ")[0].replace("Amazon ML Conference", "AMLC")} 2026, submitted` },
  ];
  const facts = [
    ["MOST RECENT", `${amazon.title}, ${amazon.company}`],
    ["EDUCATION", "B.Tech, CS (AI & ML)"],
    ["OPEN TO", "Applied Scientist · ML roles"],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f4f4f3",
          color: INK,
          fontFamily: "Geist",
        }}
      >
        {/* The hero's atmosphere: warm light top right, a dot grid that fades out. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 80% 22%, rgba(255,90,31,0.26), rgba(255,90,31,0) 52%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle, rgba(13,13,12,0.16) 1.3px, transparent 1.5px)",
            backgroundSize: "26px 26px",
          }}
        />
        {/* Satori has no mask-image, so the grid is faded by painting the page colour
            over it everywhere except around the card. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(ellipse 720px 520px at 78% 32%, rgba(244,244,243,0) 0%, rgba(244,244,243,0.35) 50%, rgba(244,244,243,1) 88%)",
          }}
        />

        <div style={{ display: "flex", width: "100%", padding: "62px 70px 56px", gap: 56 }}>
          {/* Left: kicker, headline, proof. */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT }} />
              <div style={{ fontSize: 17, letterSpacing: 3, color: MUTED }}>AI ENGINEER · APPLIED SCIENTIST</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: -2.3, lineHeight: 1.07 }}>I build AI systems,</div>
              <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: -2.3, lineHeight: 1.07 }}>
                <span style={{ marginRight: 15 }}>and the</span>
                <span style={{ color: ACCENT }}>evaluation</span>
              </div>
              <div style={{ display: "flex", fontSize: 56, fontWeight: 700, letterSpacing: -2.3, lineHeight: 1.07 }}>that proves they work.</div>
            </div>

            <div style={{ display: "flex" }}>
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: 206,
                    paddingLeft: index === 0 ? 0 : 20,
                    paddingRight: 16,
                    borderLeft: index === 0 ? "none" : `1px solid ${RULE}`,
                  }}
                >
                  <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1.4 }}>{stat.value}</div>
                  <div style={{ fontSize: 15, color: MUTED, marginTop: 6, lineHeight: 1.35 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: the snapshot card, as on the page. */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 404 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 26,
                borderRadius: 28,
                border: `1px solid ${RULE}`,
                background: "linear-gradient(180deg, #ffffff 0%, #fafaf9 60%, #f6f6f4 100%)",
                boxShadow: "0 2px 3px rgba(13,13,12,0.04), 0 22px 44px -16px rgba(13,13,12,0.18)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <img alt="" height={92} src={photo} style={{ borderRadius: 20, objectFit: "cover" }} width={92} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.8 }}>{profile.name}</div>
                  <div style={{ fontSize: 16, color: MUTED, marginTop: 3 }}>{profile.role}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginTop: 10,
                      padding: "5px 11px",
                      borderRadius: 999,
                      background: "rgba(34,197,94,0.1)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      fontSize: 14,
                      color: "#15803d",
                      alignSelf: "flex-start",
                    }}
                  >
                    <div style={{ width: 7, height: 7, borderRadius: 999, background: "#22c55e" }} />
                    Open to work
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", marginTop: 20 }}>
                {facts.map(([label, value]) => (
                  <div
                    key={label}
                    style={{ display: "flex", alignItems: "center", padding: "12px 0", borderTop: `1px solid ${RULE}` }}
                  >
                    <div style={{ width: 104, fontSize: 11.5, letterSpacing: 2, color: MUTED }}>{label}</div>
                    <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", fontSize: 14.5 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, fontSize: 21, fontWeight: 700, letterSpacing: -0.4 }}>
              moinuddin.app
              <div style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT }} />
            </div>
          </div>
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
