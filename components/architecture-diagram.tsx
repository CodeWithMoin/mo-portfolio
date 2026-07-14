export function ArchitectureDiagram({ nodes, note }: { nodes: string[]; note?: string }) {
  return (
    <figure className="rounded-[1.5rem] border border-border bg-grid p-5 sm:p-8">
      <div className="overflow-x-auto pb-2">
        <ol className="flex min-w-max items-center gap-2" aria-label="System architecture flow">
          {nodes.map((node, index) => (
            <li className="flex items-center gap-2" key={node}>
              <div className="min-w-32 rounded-xl border border-border bg-background/90 px-4 py-4 shadow-sm">
                <span className="block font-mono text-[10px] text-accent">0{index + 1}</span>
                <span className="mt-2 block text-sm font-medium">{node}</span>
              </div>
              {index < nodes.length - 1 && <span className="text-sm text-muted" aria-hidden="true">→</span>}
            </li>
          ))}
        </ol>
      </div>
      {note && <figcaption className="mt-5 max-w-3xl text-sm leading-6 text-muted">{note}</figcaption>}
    </figure>
  );
}
