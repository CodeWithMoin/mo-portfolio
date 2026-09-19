import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, projects } from "@/lib/portfolio-data";
import { profile } from "@/lib/profile";

// `output: export` requires metadata image routes to opt into static generation.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * One share card per case study, built from that project's own record.
 *
 * A shared case-study link previewing the generic site card wastes the strongest
 * thing about these pages — the measured result. This puts the project's real
 * metrics in the preview, and cannot drift from the page because it reads the
 * same data the page renders.
 */
const font = (weight: 400 | 700) => readFileSync(join(process.cwd(), "assets", "fonts", `geist-${weight}.ttf`));

/**
 * Summaries run 107–180 characters. 172 lets all but the longest through intact, and
 * cutting at a word boundary avoids stranding half a word before the ellipsis.
 */
function fit(text: string, limit = 172) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new ImageResponse(<div />, size);

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
          padding: "64px 76px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5a1f" }} />
          <div style={{ fontSize: 21, letterSpacing: 1.8, color: "#6b6862" }}>
            {`${project.eyebrow} · ${project.year}`.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -3.2, lineHeight: 1.05 }}>
            {project.title}
          </div>
          <div style={{ display: "flex", fontSize: 25, color: "#6b6862", lineHeight: 1.45, marginTop: 20, maxWidth: 950 }}>
            {fit(project.summary)}
          </div>
        </div>

        <div style={{ display: "flex", borderTop: "1px solid rgba(13,13,12,0.12)", paddingTop: 24 }}>
          {project.metrics.slice(0, 3).map((metric) => (
            <div key={metric.label} style={{ display: "flex", flexDirection: "column", width: 348, paddingRight: 26 }}>
              <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.5 }}>{metric.value}</div>
              <div style={{ fontSize: 18, color: "#6b6862", marginTop: 7, lineHeight: 1.35 }}>{metric.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: "#6b6862" }}>
          <div>{profile.name}</div>
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
