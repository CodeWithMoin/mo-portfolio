import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, projects, type Project } from "@/lib/portfolio-data";
import { profile } from "@/lib/profile";

// `output: export` requires metadata image routes to opt into static generation.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * One share card per case study, built from that project's own record and drawn in
 * the site's look: title, summary and measured results on the left; on the right the
 * project's real screenshot or figure where it has one, and its actual pipeline where
 * it does not — never an invented picture.
 */
const read = (...path: string[]) => readFileSync(join(process.cwd(), ...path));
const font = (weight: 400 | 700) => read("assets", "fonts", `geist-${weight}.ttf`);
const dataUrl = (src: string) => `data:image/jpeg;base64,${read("public", ...src.split("/").filter(Boolean)).toString("base64")}`;
const photo = dataUrl("/moinuddin.jpg");

/** Width and height from a JPEG's start-of-frame marker, so the frame can match the image. */
function jpegSize(src: string) {
  const buf = read("public", ...src.split("/").filter(Boolean));
  let offset = 2;
  while (offset < buf.length) {
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return { width: 16, height: 10 };
}

// The window's inner width; its height follows the image, within these bounds.
const FRAME_WIDTH = 500;
const FRAME_MAX = 470;

const INK = "#0d0d0c";
const MUTED = "#6b6862";
const ACCENT = "#ff5a1f";
const RULE = "rgba(13,13,12,0.09)";

function fit(text: string, limit: number) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/** The picture: a card-cropped thumbnail first, then a featured screenshot or figure. */
function visualFor(project: Project) {
  if (project.thumbnail) return { src: project.thumbnail.src, center: project.thumbnail.position === "center" };
  const shot = project.screenshots?.find((s) => s.feature) ?? project.screenshots?.[0];
  return shot ? { src: shot.src, center: true } : null;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new ImageResponse(<div />, size);

  const visual = visualFor(project);
  const dims = visual ? jpegSize(visual.src) : null;
  const imageHeight = dims ? Math.min(FRAME_MAX, Math.round((FRAME_WIDTH * dims.height) / dims.width)) : 0;
  const titleSize = project.title.length > 26 ? 44 : project.title.length > 16 ? 54 : 66;
  const stages = project.architecture.slice(0, 5);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#f4f4f3", color: INK, fontFamily: "Geist" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 80% 30%, rgba(255,90,31,0.22), rgba(255,90,31,0) 52%)",
          }}
        />

        <div style={{ display: "flex", width: "100%", padding: "56px 60px 50px", gap: 40 }}>
          {/* Left: what it is and what it measured. */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 9, height: 9, borderRadius: 999, background: ACCENT }} />
                <div style={{ fontSize: 15, letterSpacing: 2.4, color: MUTED }}>{`${project.eyebrow} · ${project.year}`.toUpperCase()}</div>
              </div>
              <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, letterSpacing: -titleSize * 0.042, lineHeight: 1.04, marginTop: 26 }}>
                {project.title}
              </div>
              <div style={{ display: "flex", fontSize: 20, color: MUTED, lineHeight: 1.45, marginTop: 18 }}>{fit(project.summary, 150)}</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{ display: "flex" }}>
                {project.metrics.slice(0, 2).map((metric, index) => (
                  <div
                    key={metric.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 250,
                      paddingLeft: index === 0 ? 0 : 20,
                      paddingRight: 14,
                      borderLeft: index === 0 ? "none" : `1px solid ${RULE}`,
                    }}
                  >
                    <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1.3 }}>{metric.value}</div>
                    <div style={{ fontSize: 15, color: MUTED, marginTop: 5, lineHeight: 1.35 }}>{fit(metric.label, 52)}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img alt="" height={34} src={photo} style={{ borderRadius: 9, objectFit: "cover" }} width={34} />
                <div style={{ fontSize: 16, fontWeight: 700 }}>{profile.name}</div>
                <div style={{ fontSize: 16, color: MUTED }}>· moinuddin.app</div>
              </div>
            </div>
          </div>

          {/* Right: the real thing, in the site's window frame. */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: FRAME_WIDTH + 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: visual ? imageHeight + 38 + 20 : 470,
              padding: 10,
              borderRadius: 26,
              background: "linear-gradient(180deg, #25252a 0%, #111318 100%)",
              boxShadow: "0 2px 4px rgba(13,13,12,0.08), 0 30px 60px -20px rgba(13,13,12,0.4)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1, borderRadius: 18, overflow: "hidden", background: "#f4f5f7" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  height: 38,
                  padding: "0 16px",
                  background: "#eff1f5",
                  borderBottom: "1px solid #d9dce2",
                  fontSize: 12,
                  letterSpacing: 2,
                  color: "#6b707c",
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#c9ccd3" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#c9ccd3" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "#c9ccd3", marginRight: 6 }} />
                {fit(project.title, 30).toUpperCase()}
              </div>

              {visual ? (
                <div style={{ display: "flex", width: FRAME_WIDTH, height: imageHeight, background: "#ffffff", overflow: "hidden" }}>
                  {/* Contained, not cropped: a cropped figure loses its axes, a cropped UI its first column. */}
                  <img alt="" src={dataUrl(visual.src)} width={FRAME_WIDTH} height={imageHeight} style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 11,
                    flex: 1,
                    padding: "0 28px",
                    backgroundImage: "linear-gradient(rgba(25,28,35,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(25,28,35,0.06) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                >
                  {stages.map((stage, index) => (
                    <div key={stage} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 22, fontSize: 13, color: "#9aa0ab" }}>{String(index + 1).padStart(2, "0")}</div>
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          padding: "11px 16px",
                          borderRadius: 10,
                          background: "#ffffff",
                          border: index === 0 ? "1px solid rgba(255,90,31,0.45)" : "1px solid #d9dce2",
                          fontSize: 17,
                          color: "#17191f",
                        }}
                      >
                        {fit(stage, 40)}
                      </div>
                    </div>
                  ))}
                  {project.architecture.length > stages.length && (
                    <div style={{ display: "flex", paddingLeft: 36, fontSize: 13, color: "#9aa0ab" }}>{`+${project.architecture.length - stages.length} more stages`}</div>
                  )}
                </div>
              )}
            </div>
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
