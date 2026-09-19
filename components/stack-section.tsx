import {
  siAppwrite, siCelery, siDocker, siExpo, siFastapi, siHuggingface, siLanggraph, siOnnx, siPostgresql,
  siPydantic, siPython, siPytorch, siReact, siRedis, siTemporal, siTensorflow,
} from "simple-icons";
import { projects } from "@/lib/portfolio-data";

/**
 * Marks, where a tool genuinely has one. Drawn in the text colour at text size:
 * recognition without the full-colour logo wall that makes a stack section look
 * like a template. Anything absent here stays text-only on purpose — concepts
 * (UMAP, "LLM evaluation") have no mark, some brands (AWS, OpenAI) withdrew theirs
 * from the open set, and pgvector does not get Postgres's elephant just because it
 * runs inside it. This is a server component, so the paths ship as static HTML.
 */
const marks: Record<string, { path: string }> = {
  FastAPI: siFastapi,
  "React 19": siReact,
  React: siReact,
  "React Native": siReact,
  PostgreSQL: siPostgresql,
  Celery: siCelery,
  Redis: siRedis,
  Python: siPython,
  LangGraph: siLanggraph,
  PyTorch: siPytorch,
  Transformers: siHuggingface,
  ONNX: siOnnx,
  "TensorFlow Lite": siTensorflow,
  Expo: siExpo,
  Appwrite: siAppwrite,
  Pydantic: siPydantic,
  Temporal: siTemporal,
  Docker: siDocker,
};

/**
 * Buckets are declared by name only. Membership is resolved against the `stack`
 * arrays on lib/portfolio-data.ts, so adding a technology to a project surfaces it
 * here automatically and nothing can claim a skill no shipped project used.
 */
export const groups: { title: string; note: string; members: string[] }[] = [
  {
    title: "ML & modelling",
    note: "Training, fine-tuning, and evaluation",
    members: ["PyTorch", "Transformers", "TensorFlow Lite", "ONNX", "Whisper-tiny", "BERTopic", "UMAP", "HDBSCAN"],
  },
  {
    title: "Methods",
    note: "How the work is done, not what it is done with",
    members: ["Experiment design", "Classification", "Hierarchical clustering", "NLP", "LLM evaluation", "Taxonomy evaluation", "Knowledge extraction"],
  },
  {
    title: "LLM systems",
    note: "Retrieval, agents, and the evaluation around them",
    members: ["LangGraph", "pgvector", "Docling", "LLM systems"],
  },
  {
    title: "Backend & data",
    note: "The services the models actually run inside",
    members: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery", "Temporal", "Docker", "Pydantic", "AWS", "Appwrite"],
  },
  {
    title: "Interfaces",
    note: "Where the output has to be legible to a person",
    members: ["React", "React 19", "React Native", "Expo", "Remotion"],
  },
];

/** Every technology that appears in at least one project's stack. */
const shipped = new Set(projects.flatMap((project) => project.stack));

/** Counts how many shipped projects used a given technology, for the density dot. */
function projectCount(member: string) {
  return projects.filter((project) => project.stack.includes(member)).length;
}

export function StackSection() {
  return (
    // A reference table, not a feature: four rows a recruiter can scan in seconds,
    // sitting under the capability map instead of claiming a section of its own.
    <dl className="divide-y divide-border border-y border-border">
      {groups.map((group) => {
        const used = group.members.filter((member) => shipped.has(member));
        if (used.length === 0) return null;

        return (
          <div className="grid gap-3 py-5 md:grid-cols-[13rem_1fr] md:items-baseline md:gap-8" key={group.title}>
            <dt>
              <span className="text-[15px] font-semibold tracking-[-0.02em]">{group.title}</span>
              <span className="mt-0.5 block text-[12.5px] leading-5 text-muted">{group.note}</span>
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-1.5">
                {used.map((member) => {
                  const count = projectCount(member);
                  return (
                    <li key={member}>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[12.5px] font-medium tracking-[-0.01em]"
                        title={`Used in ${count} ${count === 1 ? "project" : "projects"} on this site`}
                      >
                        {marks[member] && (
                          <svg aria-hidden="true" className="size-3.5 shrink-0 text-foreground/70" fill="currentColor" viewBox="0 0 24 24">
                            <path d={marks[member].path} />
                          </svg>
                        )}
                        {member}
                        {count > 1 && <span className="text-[10.5px] font-normal text-muted">×{count}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
