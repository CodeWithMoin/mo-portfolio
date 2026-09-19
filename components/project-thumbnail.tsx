import Image from "next/image";
import { PipelineVisual } from "@/components/pipeline";
import { ProjectVisual } from "@/components/project-visual";
import type { Project } from "@/lib/portfolio-data";
import { cn } from "@/lib/cn";

/**
 * Prefers a real screenshot of the running project and falls back to the generated
 * visual when there is not one yet, so adding a screenshot is a one-line data change.
 */
export function ProjectThumbnail({ project, className }: { project: Project; className?: string }) {
  // Screenshot of the running thing first; then a bespoke visual; then the
  // project's own architecture, drawn from data. Every project renders something.
  if (!project.thumbnail) {
    return project.visual ? (
      <ProjectVisual className={className} variant={project.visual} />
    ) : (
      <PipelineVisual className={className} nodes={project.architecture} />
    );
  }

  const position = project.thumbnail.position === "center" ? "object-center" : "object-top";

  return (
    <div
      className={cn(
        "visual-panel relative overflow-hidden rounded-[1.25rem] border border-white/10",
        className,
      )}
    >
      <div className="absolute inset-2 overflow-hidden rounded-[1rem] bg-[#f4f5f7] ring-1 ring-white/10">
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center gap-3 border-b border-[#d9dce2] bg-[#eff1f5] px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#6b707c]">
          <span aria-hidden="true" className="flex gap-1.5">
            <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
            <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
            <i className="size-1.5 rounded-full bg-[#c9ccd3]" />
          </span>
          <span className="truncate">{project.title}</span>
        </div>
        {/* The images sit below the title bar in their own box, so the hover zoom is
            clipped by it instead of sliding under the chrome. */}
        <div className="absolute inset-x-0 bottom-0 top-11 overflow-hidden bg-white">
          <Image
            alt={project.thumbnail.alt}
            className={cn("card-media object-cover", position)}
            fill
            sizes="(min-width: 1024px) 40rem, 100vw"
            src={project.thumbnail.src}
          />
          {project.thumbnail.hoverSrc && (
            <Image
              alt=""
              aria-hidden="true"
              className={cn("card-media card-media-alt object-cover", position)}
              fill
              sizes="(min-width: 1024px) 40rem, 100vw"
              src={project.thumbnail.hoverSrc}
            />
          )}
        </div>
      </div>
    </div>
  );
}
