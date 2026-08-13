"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type VisualVariant = "retrieval" | "taxonomy" | "research" | "edge" | "attest" | "decode";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectVisual({ variant, className }: { variant: VisualVariant; className?: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { margin: "-10% 0px -10% 0px", once: true });
  const reduceMotion = useReducedMotion();
  const show = isInView || Boolean(reduceMotion);

  return (
    <div
      aria-label={`${variant} system illustration`}
      className={cn("visual-panel relative min-h-[320px] overflow-hidden rounded-[1.25rem] border border-white/10", className)}
      ref={panelRef}
      role="img"
    >
      <div className="absolute inset-2 overflow-hidden rounded-[1rem] bg-[#f4f5f7] text-[#17191f] ring-1 ring-white/10 [clip-path:inset(0_round_1rem)]">
        <div className="absolute inset-x-0 top-0 z-20 flex h-11 items-center justify-between border-b border-[#d9dce2] bg-[#eff1f5] px-4 font-mono text-[9px] uppercase tracking-[0.18em] text-[#6b707c]">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true"><i className="size-1.5 rounded-full bg-[#c9ccd3]" /><i className="size-1.5 rounded-full bg-[#c9ccd3]" /><i className="size-1.5 rounded-full bg-[#c9ccd3]" /></span>
          <span>{variant === "edge" ? "Edge runtime" : variant === "research" ? "Evaluation bench" : variant === "taxonomy" ? "Structure workspace" : variant === "attest" ? "Verification bench" : variant === "decode" ? "Workflow control" : "Private workspace"}</span>
          </div>
          <span className="flex items-center gap-1.5 normal-case tracking-normal"><i className="size-1.5 rounded-full bg-[#149b6f]" /> Verified</span>
        </div>
        {variant === "retrieval" && <RetrievalVisual show={show} />}
        {variant === "taxonomy" && <TaxonomyVisual show={show} />}
        {variant === "research" && <ResearchVisual show={show} />}
        {variant === "edge" && <EdgeVisual show={show} />}
        {variant === "attest" && <AttestVisual show={show} />}
        {variant === "decode" && <DecodeVisual show={show} />}
      </div>
    </div>
  );
}

function RetrievalVisual({ show }: { show: boolean }) {
  return (
    <div className="grid h-full min-h-[320px] grid-cols-1 pt-11 sm:grid-cols-[1.5fr_.78fr]">
      <div className="product-grid relative flex items-center justify-center p-4 sm:p-6">
        <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }} className="w-[84%] rounded-xl border border-[#deddd8] bg-[#fdfcf9] p-4 shadow-[0_12px_30px_rgba(27,32,45,.08)]" transition={{ duration: 0.6, ease }}>
          <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-[#6b707c]"><span>Master services agreement</span><span>18 / 28</span></div>
          <div className="mt-3 h-px bg-[#deddd8]" />
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.13em]">12. Term and termination</p>
          <div className="mt-3 space-y-2"><div className="h-1.5 w-full rounded bg-[#deddd8]" /><div className="h-1.5 w-[82%] rounded bg-[#deddd8]" /></div>
          <motion.div animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0.65 }} className="mt-4 origin-left rounded-lg border-l-2 border-[#f0ae19] bg-[#fff3c8] p-3 text-[10px] leading-4" transition={{ delay: 0.25, duration: 0.55, ease }}>
            The agreement renews annually unless written notice is provided at least 60 days before renewal.
          </motion.div>
        </motion.div>
        <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 16 }} className="absolute inset-x-5 bottom-4 rounded-xl border border-[#ffc2a8] bg-white p-3 shadow-[0_15px_35px_rgba(190,74,30,.13)]" transition={{ delay: 0.48, duration: 0.6, ease }}>
          <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-medium"><i className="grid size-6 place-items-center rounded-full bg-[#ff5a1f] text-[11px] text-white">✦</i> Answer</span><span className="font-mono text-[8px] text-[#166c52]">94% confidence</span></div>
          <p className="mt-2 pl-8 text-[10px] leading-4 text-[#646a76]">Renews annually unless either party gives <b className="text-[#17191f]">60 days’ written notice.</b></p>
        </motion.div>
      </div>
      <div className="hidden border-l border-[#deddd8] bg-[#faf9f6] p-3 pt-5 sm:block">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-[#6b707c]"><span>Evidence</span><span className="rounded-full bg-[#fff3c8] px-2 py-1 text-[#8b5c00]">2 sources</span></div>
        {["Agreement.pdf", "Renewal schedule"].map((item, index) => (
          <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 8 }} className={cn("mt-3 rounded-lg border p-3", index === 0 ? "border-[#ffc2a8] bg-white shadow-sm" : "border-[#deddd8] bg-[#fdfcf9]")} key={item} transition={{ delay: 0.16 + index * 0.12, duration: 0.5, ease }}>
            <p className="truncate text-[9px] font-medium">0{index + 1} · {item}</p><p className="mt-2 font-mono text-[8px] text-[#7b808b]">Page {index ? 4 : 18} · {index ? 89 : 96}%</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TaxonomyVisual({ show }: { show: boolean }) {
  const nodes = ["Billing", "Delivery", "Returns", "Quality"];
  return (
    <div className="product-grid flex h-full min-h-[320px] flex-col justify-center px-5 pb-5 pt-16">
      <div className="grid grid-cols-[.82fr_auto_1.18fr] items-center gap-3">
        <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : -10 }} className="rounded-xl border border-[#deddd8] bg-[#fdfcf9] p-4 shadow-sm" transition={{ duration: 0.55, ease }}>
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#737986]">Unstructured feedback</p>
          <div className="mt-4 space-y-2">{["w-full", "w-[88%]", "w-[70%]"].map((width) => <div className={cn("h-1.5 rounded bg-[#dfe2e8]", width)} key={width} />)}</div>
          <span className="mt-4 inline-flex rounded-full bg-[#fff1ea] px-2 py-1 font-mono text-[8px] text-[#c04315]">80k records</span>
        </motion.div>
        <motion.div animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0 }} className="h-px w-8 origin-left bg-[#ffab85]" transition={{ delay: 0.28, duration: 0.45, ease }} />
        <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 10 }} className="rounded-xl border border-[#ffc2a8] bg-white p-4 shadow-[0_12px_30px_rgba(190,74,30,.1)]" transition={{ delay: 0.35, duration: 0.55, ease }}>
          <div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#c04315]">Induced hierarchy</p><span className="rounded-full bg-[#fff3c8] px-2 py-1 font-mono text-[8px] text-[#8b5c00]">F1 · 0.74</span></div>
          <div className="mt-4 rounded-lg border border-[#ffdccd] bg-[#fff1ea] px-3 py-2 text-[10px] font-medium">Customer signals</div>
          <div className="ml-5 h-3 border-l border-[#ffab85]" />
          <div className="grid grid-cols-2 gap-2">
            {nodes.map((node, index) => <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 6 }} className="rounded-md border border-[#deddd8] bg-[#fdfcf9] px-2 py-2 text-[9px]" key={node} transition={{ delay: 0.55 + index * 0.08, duration: 0.42, ease }}>{node}</motion.div>)}
          </div>
        </motion.div>
      </div>
      <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} className="mt-4 flex items-center justify-between rounded-lg border border-[#deddd8] bg-[#fdfcf9]/90 px-3 py-2 font-mono text-[8px] text-[#6b707c]" transition={{ delay: 0.85, duration: 0.5, ease }}><span>BERTopic · UMAP · HDBSCAN</span><span className="text-[#c04315]">Structure validated</span></motion.div>
    </div>
  );
}

function ResearchVisual({ show }: { show: boolean }) {
  return (
    <div className="grid h-full min-h-[320px] grid-cols-[1.1fr_.9fr] gap-3 px-4 pb-4 pt-14">
      <div className="flex flex-col justify-center rounded-xl border border-[#deddd8] bg-[#fdfcf9] p-4 shadow-sm">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.14em] text-[#6b707c]"><span>Scale benchmark</span><span>5,000 labels</span></div>
        <div className="mt-5 flex h-36 items-end gap-2 border-b border-l border-[#deddd8] px-2 pb-1">
          {[40, 56, 48, 70, 64, 91].map((height, index) => <motion.div animate={{ scaleY: show ? 1 : 0.05 }} className={cn("flex-1 origin-bottom rounded-t", index === 5 ? "bg-[#ff5a1f]" : "bg-[#ffc7ab]")} key={height} style={{ height: `${height}%` }} transition={{ delay: 0.08 * index, duration: 0.62, ease }} />)}
        </div>
        <div className="mt-3 flex justify-between font-mono text-[8px] text-[#7b808b]"><span>621</span><span>Taxonomy scale</span><span>5k</span></div>
      </div>
      <div className="flex flex-col justify-center gap-2">
        {[["Semantic quality", ".83"], ["Boundary ambiguity", ".71"], ["Hierarchy utility", ".64"]].map(([label, score], index) => (
          <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 8 }} className="rounded-lg border border-[#deddd8] bg-[#fdfcf9] p-3" key={label} transition={{ delay: 0.25 + index * 0.1, duration: 0.48, ease }}>
            <div className="flex items-center justify-between"><span className="text-[9px] font-medium">{label}</span><span className="font-mono text-[8px] text-[#c04315]">{score}</span></div>
            <div className="mt-2 h-1 overflow-hidden rounded bg-[#e8e9ec]"><motion.div animate={{ scaleX: show ? 1 : 0 }} className="h-full origin-left rounded bg-[#ffab85]" style={{ width: `${83 - index * 11}%` }} transition={{ delay: 0.45 + index * 0.1, duration: 0.55, ease }} /></div>
          </motion.div>
        ))}
        <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 7 }} className="rounded-lg border border-[#f1cf69] bg-[#fff3c8] px-3 py-3 font-mono text-[8px] font-medium text-[#7a5300]" transition={{ delay: 0.7, duration: 0.48, ease }}>25× lower reported cost</motion.div>
      </div>
    </div>
  );
}

function EdgeVisual({ show }: { show: boolean }) {
  return (
    <div className="product-grid flex h-full min-h-[320px] items-center justify-center px-4 pb-4 pt-14">
      <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }} className="relative h-[222px] w-[118px] rounded-[1.65rem] border border-[#cfd2d8] bg-[#fdfcf9] p-2 shadow-[0_16px_35px_rgba(27,32,45,.14)]" transition={{ duration: 0.6, ease }}>
        <div className="absolute left-1/2 top-2 h-1.5 w-9 -translate-x-1/2 rounded-full bg-[#d7d9dd]" />
        <div className="flex h-full flex-col items-center justify-center rounded-[1.2rem] border border-[#e1e2e4] bg-white px-3 text-center">
          <motion.div animate={{ scale: show ? 1 : 0.8 }} className="grid size-12 place-items-center rounded-full border border-[#ffc2a8] bg-[#fff1ea] text-lg text-[#c04315]" transition={{ delay: 0.18, duration: 0.48, ease }}>♻</motion.div>
          <p className="mt-4 text-xs font-medium">Recyclable</p><p className="mt-1 font-mono text-[8px] text-[#727884]">82% confidence</p>
          <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 5 }} className="mt-4 w-full rounded-full bg-[#ff5a1f] px-2 py-1.5 font-mono text-[7px] font-semibold text-white" transition={{ delay: 0.48, duration: 0.45, ease }}>SORT LOCALLY</motion.div>
        </div>
      </motion.div>
      <div className="ml-4 space-y-2">
        {["<300ms", "−60%", "Offline"].map((metric, index) => <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 8 }} className={cn("rounded-lg border bg-[#fdfcf9] px-4 py-3", index === 2 ? "border-[#addbc9]" : "border-[#deddd8]")} key={metric} transition={{ delay: 0.26 + index * 0.1, duration: 0.45, ease }}><p className={cn("font-mono text-xs", index === 2 ? "text-[#166c52]" : "text-[#4f5662]")}>{metric}</p></motion.div>)}
      </div>
    </div>
  );
}

function AttestVisual({ show }: { show: boolean }) {
  return (
    <div className="product-grid flex h-full min-h-[320px] flex-col justify-center gap-3 px-4 pb-4 pt-14 sm:px-6">
      <div className="grid gap-3 sm:grid-cols-[.82fr_1.18fr]">
        <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : -10 }} className="rounded-xl border border-[#deddd8] bg-[#fdfcf9] p-4 shadow-sm" transition={{ duration: 0.55, ease }}>
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#737986]">Incoming claim</p>
          <p className="mt-4 text-[11px] font-medium leading-5">The agreement renews annually unless written notice is provided.</p>
          <div className="mt-4 flex items-center gap-2 font-mono text-[8px] text-[#6b707c]"><span className="size-1.5 rounded-full bg-[#ff5a1f]" /> Needs evidence</div>
        </motion.div>
        <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 10 }} className="rounded-xl border border-[#ffc2a8] bg-white p-4 shadow-[0_12px_30px_rgba(190,74,30,.1)]" transition={{ delay: 0.2, duration: 0.55, ease }}>
          <div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#c04315]">Retrieved evidence</p><span className="rounded-full bg-[#fff1ea] px-2 py-1 font-mono text-[8px] text-[#c04315]">2 passages</span></div>
          <div className="mt-4 space-y-2"><div className="rounded-lg border border-[#ffdccd] bg-[#fff8f4] px-3 py-2 text-[9px] leading-4">MSA · page 18 <span className="float-right font-mono text-[#c04315]">.96</span></div><div className="rounded-lg border border-[#deddd8] bg-[#fdfcf9] px-3 py-2 text-[9px] leading-4">Renewal schedule · page 4 <span className="float-right font-mono text-[#6b707c]">.89</span></div></div>
        </motion.div>
      </div>
      <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} className="rounded-xl border border-[#f1cf69] bg-[#fff3c8] px-4 py-3" transition={{ delay: 0.48, duration: 0.5, ease }}>
        <div className="flex items-center justify-between"><span className="text-[10px] font-medium">Verified answer</span><span className="font-mono text-[8px] text-[#8b5c00]">4.15% citation failures</span></div>
        <p className="mt-2 text-[10px] leading-4 text-[#51420f]">Evidence supports annual renewal with 60 days&apos; written notice.</p>
      </motion.div>
    </div>
  );
}

function DecodeVisual({ show }: { show: boolean }) {
  const departments = ["Architect", "Author", "Visualizer", "Renderer"];
  return (
    <div className="product-grid flex h-full min-h-[320px] flex-col justify-center px-4 pb-4 pt-14 sm:px-6">
      <div className="rounded-xl border border-[#deddd8] bg-[#fdfcf9] p-4 shadow-sm">
        <div className="flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.15em] text-[#6b707c]"><span>Artifact lineage</span><span>Research paper → video</span></div>
        <div className="mt-4 grid grid-cols-[.8fr_auto_1.2fr] items-center gap-2">
          <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : -8 }} className="rounded-lg border border-[#deddd8] bg-white p-3" transition={{ duration: 0.5, ease }}><p className="font-mono text-[8px] uppercase text-[#737986]">Input</p><p className="mt-2 text-[10px] font-medium">Production brief</p><p className="mt-1 font-mono text-[8px] text-[#6b707c]">v3 · from paper</p></motion.div>
          <motion.div animate={{ opacity: show ? 1 : 0, scaleX: show ? 1 : 0 }} className="h-px w-6 origin-left bg-[#ffab85]" transition={{ delay: 0.24, duration: 0.4, ease }} />
          <motion.div animate={{ opacity: show ? 1 : 0, x: show ? 0 : 8 }} className="rounded-lg border border-[#ffc2a8] bg-[#fff1ea] p-3" transition={{ delay: 0.3, duration: 0.5, ease }}><div className="flex items-center justify-between"><p className="font-mono text-[8px] uppercase text-[#c04315]">Departments</p><span className="text-[9px] text-[#149b6f]">● building</span></div><div className="mt-3 grid grid-cols-2 gap-2">{departments.map((department, index) => <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 5 }} className="rounded-md border border-[#ffdccd] bg-white px-2 py-2 text-[9px]" key={department} transition={{ delay: 0.48 + index * 0.08, duration: 0.4, ease }}>{department}</motion.div>)}</div></motion.div>
        </div>
      </div>
      <motion.div animate={{ opacity: show ? 1 : 0, y: show ? 0 : 8 }} className="mt-3 grid grid-cols-3 gap-2 font-mono text-[8px]" transition={{ delay: 0.75, duration: 0.5, ease }}>
        <div className="rounded-lg border border-[#deddd8] bg-[#fdfcf9] px-3 py-3"><span className="text-[#6b707c]">Departments</span><strong className="mt-1 block text-[11px] text-[#17191f]">8</strong></div>
        <div className="rounded-lg border border-[#deddd8] bg-[#fdfcf9] px-3 py-3"><span className="text-[#6b707c]">Loop</span><strong className="mt-1 block text-[11px] text-[#149b6f]">3-step</strong></div>
        <div className="rounded-lg border border-[#f1cf69] bg-[#fff3c8] px-3 py-3"><span className="text-[#8b5c00]">SSE</span><strong className="mt-1 block text-[11px] text-[#7a5300]">resumable</strong></div>
      </motion.div>
    </div>
  );
}
