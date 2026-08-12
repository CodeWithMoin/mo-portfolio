export type Project = {
  slug: string;
  index: string;
  title: string;
  eyebrow: string;
  year: string;
  summary: string;
  thesis: string;
  role: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  visual: "retrieval" | "taxonomy" | "research" | "edge" | "attest" | "decode";
  links: { label: string; href: string }[];
  problem: string;
  why: string;
  architecture: string[];
  architectureNote: string;
  challenges: { title: string; detail: string }[];
  tradeoffs: { decision: string; rationale: string }[];
  experiments: string[];
  results: string[];
  lessons: string[];
  future: string[];
};

export const projects: Project[] = [
  {
    slug: "doculens-ai",
    index: "01",
    title: "DocuLens AI",
    eyebrow: "Open-source document intelligence",
    year: "2025–Now",
    summary:
      "A citation-first document system that turns unstructured files into searchable, operational knowledge—without hiding retrieval behind a chat box.",
    thesis:
      "Reliable document AI begins with provenance, measurable retrieval, and asynchronous work—not a clever prompt.",
    role: "Creator · Product, system design, ML and full-stack engineering",
    metrics: [
      { value: "10K+", label: "documents designed for" },
      { value: "<800ms", label: "retrieval latency" },
      { value: "<3s", label: "end-to-end response" },
    ],
    stack: ["FastAPI", "React 19", "PostgreSQL", "pgvector", "Celery", "Redis", "Docling"],
    visual: "retrieval",
    links: [
      { label: "Live prototype", href: "https://doculens-ai.pages.dev/" },
      { label: "Source", href: "https://github.com/CodeWithMoin/doculens-ai" },
    ],
    problem:
      "Business documents contain decisions, obligations, and evidence, but most systems flatten them into text and return answers that are difficult to audit. Teams need a way to ingest files at scale, retrieve the right context, and trace every answer back to a source.",
    why:
      "A plausible answer without provenance is operationally weak. In document-heavy work, the system must make failure visible: what was retrieved, which page supported the answer, and how confident the pipeline is.",
    architecture: [
      "React console",
      "FastAPI gateway",
      "Durable event",
      "Celery worker",
      "Docling + chunks",
      "pgvector retrieval",
      "Grounded answer",
    ],
    architectureNote:
      "The event record is the durable boundary between HTTP and model work. Workers can retry slow extraction or provider calls without holding request threads, while typed pipeline contexts preserve an audit trail.",
    challenges: [
      {
        title: "Preserving evidence",
        detail:
          "Every vector carries document, chunk, page, title, and token metadata so citations survive ingestion, retrieval, and answer generation.",
      },
      {
        title: "Separating latency classes",
        detail:
          "FastAPI acknowledges work quickly; Celery handles extraction and model calls with bounded execution, late acknowledgement, and worker-loss recovery.",
      },
      {
        title: "Making retrieval testable",
        detail:
          "Offline Recall@K and MRR utilities turn chunking and ranking changes into experiments instead of aesthetic prompt tweaks.",
      },
    ],
    tradeoffs: [
      {
        decision: "Modular monolith over early microservices",
        rationale: "One deployable backend keeps operations and contribution simple until scaling evidence justifies extraction.",
      },
      {
        decision: "Dense-first retrieval",
        rationale: "A coherent baseline came before hybrid ranking; reciprocal-rank fusion is reserved for a labelled benchmark.",
      },
      {
        decision: "Read-only public showcase",
        rationale: "Recruiters can inspect completed workflows without public uploads, visitor data, or model spend.",
      },
    ],
    experiments: [
      "Measured retrieval independently from generation with labelled relevant-chunk fixtures.",
      "Bounded chunks by tokens while preserving layout and page provenance.",
      "Added provider-neutral structured outputs to compare model behavior behind the same contract.",
    ],
    results: [
      "Sub-800ms retrieval and under-three-second end-to-end responses in the project benchmark.",
      "One operator surface for ingestion, classification, summaries, search, QA history, and lifecycle actions.",
      "MIT-licensed implementation with CI, typed contracts, deployment runbooks, and an openly accessible product tour.",
    ],
    lessons: [
      "Evaluation belongs beside retrieval code, not in a separate demo notebook.",
      "Citation UX is part of model reliability because it changes how people verify and act on answers.",
      "A public demo can communicate a system honestly without exposing mutable infrastructure.",
    ],
    future: [
      "Publish a redistributable labelled retrieval benchmark.",
      "Evaluate dense and keyword fusion with reciprocal-rank fusion.",
      "Add OpenTelemetry traces and provider latency and cost dashboards.",
    ],
  },
  {
    slug: "attest",
    index: "02",
    title: "Attest",
    eyebrow: "Agentic retrieval · Self-verifying answers",
    year: "2026",
    summary:
      "An agentic RAG system that checks every generated claim against retrieved evidence, revises boundedly, and escalates uncertainty instead of smoothing it over.",
    thesis:
      "Grounded generation is not complete when a model cites something. It is complete when the system can verify the claim, measure the failure, and know when to ask for help.",
    role: "Builder · Retrieval, verification, evaluation, and backend reliability",
    metrics: [
      { value: "4.15%", label: "failing citations after verification" },
      { value: "0.473", label: "evidence F1 on Qasper" },
      { value: "41", label: "questions in benchmark" },
    ],
    stack: ["Python", "LangGraph", "FastAPI", "PostgreSQL", "pgvector", "Redis"],
    visual: "attest",
    links: [],
    problem:
      "RAG systems can produce fluent answers whose citations do not actually support the claim being made. That makes a high-level answer score a poor proxy for whether a user can safely act on it.",
    why:
      "Evidence quality is a systems problem: retrieval, generation, verification, revision, and escalation all need explicit boundaries so uncertainty remains visible instead of becoming confident prose.",
    architecture: [
      "Question",
      "Hybrid retrieval",
      "Reranking",
      "Draft answer",
      "Independent judge",
      "Bounded revision",
      "Human escalation",
    ],
    architectureNote:
      "The judge model receives the claim and exact retrieved passages, not the generator's hidden reasoning. It can approve, request a bounded revision, or route the case to human review.",
    challenges: [
      {
        title: "Verifying the exact claim",
        detail:
          "The system evaluates claim-to-passage support rather than treating the presence of a citation as proof of grounding.",
      },
      {
        title: "Combining retrieval signals",
        detail:
          "pgvector similarity and PostgreSQL full-text search are fused before reranking so exact terms and semantic matches can both survive retrieval.",
      },
      {
        title: "Making uncertainty actionable",
        detail:
          "Explicit metrics distinguish supported answers, unsupported claims, and cases that should be escalated rather than revised indefinitely.",
      },
    ],
    tradeoffs: [
      {
        decision: "Independent judge over self-checking generation",
        rationale: "A separate verifier creates a meaningful failure boundary instead of asking the same generation path to grade itself.",
      },
      {
        decision: "Bounded revision over open-ended reflection",
        rationale: "A fixed retry budget makes latency and cost predictable while preserving a clear escalation path.",
      },
      {
        decision: "Evidence metrics over answer fluency",
        rationale: "The benchmark rewards support and calibrated failure, not only a readable final sentence.",
      },
    ],
    experiments: [
      "Compared citation failure rates before and after claim-level verification on a 41-question benchmark.",
      "Evaluated hybrid retrieval and reranking against semantic retrieval alone.",
      "Measured evidence F1 on human-annotated Qasper examples.",
    ],
    results: [
      "Reduced failing citations from 9.87% to 4.15% after verification.",
      "Reached 0.473 evidence F1 on the human-annotated Qasper benchmark.",
      "Produced explicit escalation signals for unsupported answers and uncertain cases.",
    ],
    lessons: [
      "A citation is a pointer; verification tests whether it actually supports the claim.",
      "Retrieval quality and evaluator quality are coupled system dependencies.",
      "Human escalation is a reliability feature when the system knows what it cannot prove.",
    ],
    future: [
      "Expand claim decomposition for multi-part answers.",
      "Publish a reproducible citation-verification benchmark.",
      "Track verifier calibration and cost-quality tradeoffs across providers.",
    ],
  },
  {
    slug: "decode",
    index: "03",
    title: "Decode",
    eyebrow: "Multi-agent workflow · Artifact lineage",
    year: "2026",
    summary:
      "A production workflow for eight department-specific agents, with versioned artifacts, dependency-aware regeneration, and recoverable asynchronous execution.",
    thesis:
      "Multi-agent systems become useful when their work is inspectable, resumable, and bounded—not when they simply add more agents to a prompt.",
    role: "Builder · Orchestration, artifact contracts, and distributed reliability",
    metrics: [
      { value: "8", label: "department agents" },
      { value: "3-step", label: "generate / evaluate / revise loop" },
      { value: "SSE", label: "resumable execution stream" },
    ],
    stack: ["Python", "FastAPI", "Redis", "ARQ", "PostgreSQL", "SSE"],
    visual: "decode",
    links: [],
    problem:
      "A multi-agent workflow can create useful work and still be impossible to operate if outputs cannot be traced, retries duplicate side effects, or one failed step forces the entire run to restart.",
    why:
      "The product is the workflow boundary: each artifact needs a version, each dependency needs a record, and each retry needs to be safe enough for production execution.",
    architecture: [
      "Workflow request",
      "ARQ queue",
      "Department agents",
      "Artifact store",
      "Dependency graph",
      "Transactional outbox",
      "Resumable SSE",
    ],
    architectureNote:
      "Versioned artifacts and content hashes let the system regenerate only affected downstream work. Reliability primitives fence stale runs, make retries idempotent, and keep progress observable to the caller.",
    challenges: [
      {
        title: "Keeping outputs traceable",
        detail:
          "Every artifact records its version, content hash, and upstream dependencies so a reviewer can follow the work back to its inputs.",
      },
      {
        title: "Recovering from partial failure",
        detail:
          "Retries, stale-run fencing, and a transactional outbox preserve progress while preventing duplicate downstream effects.",
      },
      {
        title: "Making async work visible",
        detail:
          "Resumable server-sent events keep clients informed even when the worker or network connection is interrupted.",
      },
    ],
    tradeoffs: [
      {
        decision: "Explicit artifact graph over hidden agent state",
        rationale: "A durable graph makes invalidation and review possible without reconstructing the model's internal context.",
      },
      {
        decision: "Bounded loops over autonomous recursion",
        rationale: "Each agent can generate, evaluate, and revise within a known budget before escalating to a human.",
      },
      {
        decision: "PostgreSQL and Redis over a new orchestration platform",
        rationale: "Existing durable primitives keep the system understandable while the workflow contracts are still evolving.",
      },
    ],
    experiments: [
      "Exercised generate/evaluate/revise loops with bounded retries and explicit human escalation.",
      "Regenerated downstream artifacts after changing one upstream content hash.",
      "Interrupted workers and SSE connections to validate recovery and resume behavior.",
    ],
    results: [
      "Coordinated eight department-specific agents behind one observable workflow boundary.",
      "Made artifact provenance and selective regeneration first-class system behavior.",
      "Added production reliability primitives for idempotent, resumable asynchronous work.",
    ],
    lessons: [
      "Agent autonomy needs a durable contract with the rest of the system.",
      "Lineage is useful only when it changes what gets recomputed and what can be reviewed.",
      "A recoverable workflow is more valuable than a clever but opaque orchestration demo.",
    ],
    future: [
      "Add operator views for artifact diffs and dependency invalidation.",
      "Benchmark queue fairness and throughput as department count grows.",
      "Instrument end-to-end cost and latency by agent and workflow stage.",
    ],
  },
  {
    slug: "amazon-applied-science",
    index: "04",
    title: "Autonomous Taxonomy Systems at Amazon",
    eyebrow: "Applied science · Public summary",
    year: "2026",
    summary:
      "A self-calibrating applied AI system that turns large-scale customer feedback into explainable three-level taxonomies—without a scientist hand-tuning every new domain.",
    thesis:
      "The hard part was not generating a hierarchy. It was replacing a multi-notebook expert workflow with a system that calibrates itself, beats the manual baseline, and explains its own quality.",
    role: "Applied Scientist Intern · Owned KIE self-service end to end; scope expanded to taxonomy generation, explainability, and first-author research",
    metrics: [
      { value: "0.74", label: "F1 vs. 0.71 baseline" },
      { value: "<18h", label: "onboarding cycle" },
      { value: "2.7×", label: "faster extraction" },
    ],
    stack: ["LLM systems", "BERTopic", "UMAP", "HDBSCAN", "Knowledge extraction", "Taxonomy evaluation", "AWS"],
    visual: "taxonomy",
    links: [],
    problem:
      "Creating a taxonomy for a new feedback domain required a seven-notebook workflow: scientists selected examples, tuned prompts, ran clustering, and manually stitched a three-level hierarchy. Each domain consumed five to seven days of expert time and kept scientists in every step.",
    why:
      "Taxonomies determine which customer issues become visible to product teams. If onboarding remains expert-bound, scale stops at scientist availability; if the hierarchy overlaps or duplicates concepts, the resulting issue counts become misleading.",
    architecture: [
      "Raw feedback",
      "Self-calibrating KIE",
      "Four-pillar evidence",
      "BERTopic L3 discovery",
      "LLM hierarchy induction",
      "Grounded explainability",
    ],
    architectureNote:
      "The public pattern is a two-phase system: mine and validate a small, diverse in-domain example set, then run cached batch extraction at scale. Structured phrases feed density-based L3 discovery; the LLM classifies those clusters into a disjoint hierarchy, while deterministic attribution computes every quality claim before the LLM renders it in plain language.",
    challenges: [
      {
        title: "Calibrating without labelled training data",
        detail:
          "The pipeline mines candidates from the target domain, checks every extraction against its source, ranks quality and structural diversity, and selects a compact few-shot set automatically.",
      },
      {
        title: "Preserving context through clustering",
        detail:
          "Generic phrases collapsed unrelated products into catch-all clusters. Explicitly bracketing category and aspect fields restored the context the embedder needed to separate them.",
      },
      {
        title: "Knowing where the LLM belongs",
        detail:
          "Recursive density clustering produced overlapping parent themes. The system pivoted to density discovery for L3 and constrained LLM classification for L1/L2, where model behavior was more reliable.",
      },
      {
        title: "Explaining metrics without invented claims",
        detail:
          "Python identifies the exact node driving each quality score and validates paths and rankings. The LLM only translates grounded attribution into a concise explanation.",
      },
    ],
    tradeoffs: [
      {
        decision: "KIE before taxonomy generation",
        rationale: "Directly embedding raw anecdotes lost the four distinct issue pillars and amplified noise. Structured extraction added a stage, but made downstream taxonomies separable and auditable.",
      },
      {
        decision: "Two-model calibration and extraction",
        rationale: "A stronger judge is reserved for the quality-critical calibration step; a lower-cost extractor handles full-scale cached inference.",
      },
      {
        decision: "Algorithms decide; the LLM communicates",
        rationale: "Deterministic code owns metric attribution and validation. The model is used for semantic labeling and readable language, not numerical truth.",
      },
    ],
    experiments: [
      "Ablated KIE entirely and confirmed that raw anecdotes were too noisy to form four coherent pillar taxonomies.",
      "Compared zero-shot and few-shot extraction, plus in-domain and cross-domain examples; selected compact in-domain few-shot calibration to preserve domain-specific failure patterns.",
      "Swept calibration sizes from 10 to 1,000 examples instead of choosing the pilot size by intuition.",
      "Compared direct one-shot prompting, bottom-up BERTopic, and top-down Leiden against the same manual baseline and holistic evaluation framework.",
    ],
    results: [
      "Reduced a five-to-seven-day scientist workflow to an autonomous run under 18 hours.",
      "Improved taxonomy F1 from a 0.71 manual baseline to 0.73 with BERTopic and 0.74 with Leiden.",
      "Reduced missing Category and Aspect extractions from roughly 23.8% to 0.7% in the documented evaluation.",
      "Cut extraction time by 2.7× and inference cost by 53% through prompt caching and cross-region execution.",
      "Shipped the KIE system as a production container for multi-domain, million-record workloads.",
    ],
    lessons: [
      "LLMs were better at classifying discovered structure than discovering the structure itself.",
      "Self-calibration is a product capability: it determines whether a new user can onboard a domain without a scientist.",
      "An explainable metric needs deterministic attribution before fluent language.",
      "A test-set improvement is not enough; production behavior still decides whether an idea survives.",
    ],
    future: [
      "Complete production launch of the grounded metrics-explainability layer.",
      "Extend calibration and hierarchy evaluation across more domains and drift patterns.",
      "Connect structural quality measures to downstream issue-discovery decisions.",
    ],
  },
  {
    slug: "taxonomy-evaluation-research",
    index: "05",
    title: "Evaluation for Taxonomies at Scale",
    eyebrow: "Research · UAM + LUMEN",
    year: "2026",
    summary:
      "Research on measuring hierarchical structure and robust LLM classification—from hundreds to thousands of categories.",
    thesis:
      "As label spaces grow, evaluation must distinguish genuine structure from duplicated concepts, brittle boundaries, and expensive model behavior.",
    role: "First author, UAM · Third author, LUMEN",
    metrics: [
      { value: "621–5K", label: "category scale studied" },
      { value: "25×", label: "lower reported cost" },
      { value: "2", label: "2026 submissions" },
    ],
    stack: ["LLM evaluation", "NLP", "Hierarchical clustering", "Classification", "Experiment design"],
    visual: "research",
    links: [],
    problem:
      "A taxonomy can look coherent while repeating the same idea across branches. At the same time, classification systems that work at small label counts can become costly or unstable as the taxonomy grows.",
    why:
      "Teams use taxonomies to aggregate evidence and decide what to fix. Structural duplication distorts counts, while classification cost can make an otherwise accurate system impractical.",
    architecture: [
      "Raw anecdotes",
      "Candidate hierarchy",
      "Structural measures",
      "Scale-aware classifier",
      "Error analysis",
      "Human-readable finding",
    ],
    architectureNote:
      "UAM focuses on evaluating generated hierarchical structure and surfacing duplication. LUMEN studies robust classification across taxonomy scales from 621 to 5,000 categories.",
    challenges: [
      {
        title: "Measuring hierarchy, not just labels",
        detail: "Designed analysis around parent-child structure, overlap, and duplicated concepts rather than only flat accuracy.",
      },
      {
        title: "Holding comparisons fair",
        detail: "Evaluated systems across a wide category range so model quality and cost could be compared under increasing complexity.",
      },
      {
        title: "Turning anomalies into findings",
        detail: "Connected quantitative structure checks to a failure mode people could inspect and reason about.",
      },
    ],
    tradeoffs: [
      {
        decision: "Interpretable measures over one composite score",
        rationale: "Separate signals made structural failure modes visible and actionable.",
      },
      {
        decision: "Scale sweep over a single benchmark point",
        rationale: "A model that is practical at hundreds of classes may behave differently at thousands.",
      },
      {
        decision: "Submission status stated explicitly",
        rationale: "The portfolio does not imply acceptance or publish details that are still under review.",
      },
    ],
    experiments: [
      "Compared hierarchy evaluation behavior across generated and human-constructed structures.",
      "Swept classification scale from 621 to 5,000 categories.",
      "Tracked model quality together with inference cost rather than optimizing either in isolation.",
    ],
    results: [
      "UAM identified a previously hidden duplication failure mode in human-built structures.",
      "LUMEN matched a frontier model's reported accuracy at 25× lower cost across the studied scales.",
      "The work produced two 2026 submissions: UAM as first author and LUMEN as third author.",
    ],
    lessons: [
      "Human-authored structure is a baseline, not ground truth beyond inspection.",
      "Cost belongs in the scientific result when it changes deployability.",
      "Error analysis is most valuable when it reveals a repeatable failure class.",
    ],
    future: [
      "Release public artifacts when review and confidentiality constraints allow.",
      "Extend structural measures to deeper and evolving hierarchies.",
      "Study how taxonomy quality changes downstream prioritization decisions.",
    ],
  },
  {
    slug: "ecoguardian-ai",
    index: "06",
    title: "EcoGuardian AI",
    eyebrow: "On-device applied ML",
    year: "2025",
    summary:
      "A mobile waste-classification prototype that brings fast, offline guidance to resource-constrained devices.",
    thesis:
      "The useful model is the one that fits the device, responds in the moment, and still clears an evidence-based quality bar.",
    role: "AI engineer · Model optimization and mobile product prototype",
    metrics: [
      { value: "82%", label: "model accuracy" },
      { value: "<300ms", label: "on-device inference" },
      { value: "−60%", label: "model size" },
    ],
    stack: ["TensorFlow Lite", "React Native", "Expo", "Python", "Appwrite"],
    visual: "edge",
    links: [{ label: "Source", href: "https://github.com/CodeWithMoin/EcoGuardian-AI" }],
    problem:
      "Waste-sorting guidance is most useful at the moment of disposal, but a cloud-dependent classifier adds latency, connectivity risk, and privacy cost to a simple decision.",
    why:
      "A phone-based system can make guidance immediate and accessible. Running locally also keeps camera input on device and makes the core classification flow available offline.",
    architecture: [
      "Camera frame",
      "Image preprocessing",
      "Quantized TFLite model",
      "Material class",
      "Disposal guidance",
      "Optional Appwrite sync",
    ],
    architectureNote:
      "The classification path stays on device. Cloud services are separated for optional identity, persistence, and community features rather than required for inference.",
    challenges: [
      {
        title: "Fitting the model to the phone",
        detail: "Used post-training quantization to shrink the model while monitoring accuracy and latency together.",
      },
      {
        title: "Designing for the camera loop",
        detail: "Structured the prototype around capture, review, classification, and clear disposal guidance instead of a generic ML result screen.",
      },
      {
        title: "Keeping offline as the default",
        detail: "Separated inference from optional backend features so the core utility does not disappear with connectivity.",
      },
    ],
    tradeoffs: [
      {
        decision: "Quantized model over maximum desktop accuracy",
        rationale: "Sub-300ms local feedback was part of the product requirement, not a later optimization.",
      },
      {
        decision: "Three actionable categories",
        rationale: "Recycling, compost, and landfill map model output to a decision people can make immediately.",
      },
      {
        decision: "Optional cloud services",
        rationale: "Community and history features can sync later without making core classification fragile.",
      },
    ],
    experiments: [
      "Measured accuracy after post-training quantization.",
      "Benchmarked inference on the target mobile path rather than extrapolating from desktop performance.",
      "Tested the product flow around a camera-first interaction and immediate guidance.",
    ],
    results: [
      "Reached 82% classification accuracy in the project benchmark.",
      "Reduced model size by 60% while keeping inference under 300ms.",
      "Delivered a fully offline core classification experience.",
    ],
    lessons: [
      "Latency and package size are model-quality dimensions on edge devices.",
      "A constrained label space can produce a clearer product decision than a larger but ambiguous ontology.",
      "Cloud independence is both a reliability and privacy feature.",
    ],
    future: [
      "Validate on a broader, more representative image set.",
      "Complete end-to-end inference wiring and field testing across target devices.",
      "Add calibrated uncertainty and a safe fallback when the image is out of distribution.",
    ],
  },
];

export const publications = [
  {
    title: "Universal Anecdote Miner (UAM)",
    venue: "Amazon ML Conference · 2026",
    role: "First author",
    status: "Submitted",
    abstract:
      "A framework for evaluating how automated systems construct hierarchical structure from raw feedback, including analysis of a subtle duplication failure mode in human-built taxonomies.",
  },
  {
    title: "LUMEN: Robust LLM Classification Across Taxonomy Scales",
    venue: "AMLC + EMNLP · 2026",
    role: "Third author",
    status: "Submitted",
    abstract:
      "A scale-aware classification study spanning 621 to 5,000 categories, matching a frontier model's reported accuracy at 25× lower cost.",
  },
];

export const interests = [
  {
    title: "Reliable AI Systems",
    detail: "Grounded outputs, calibrated failure, provenance, and operator-visible evidence.",
  },
  {
    title: "Retrieval",
    detail: "Layout-aware ingestion, ranking, hybrid search, citations, and measurable recall.",
  },
  {
    title: "LLM Evaluation",
    detail: "Task-specific metrics, structural error analysis, cost-quality tradeoffs, and judge reliability.",
  },
  {
    title: "ML Infrastructure",
    detail: "Typed pipelines, asynchronous execution, observability, reproducible experiments, and model serving.",
  },
  {
    title: "Distributed Systems",
    detail: "Durable work boundaries, retries, idempotency, queues, consistency, and failure recovery.",
  },
  {
    title: "Backend Engineering",
    detail: "Versioned APIs, data contracts, authentication, lifecycle design, and production safety.",
  },
  {
    title: "Applied Machine Learning",
    detail: "Problem framing, baselines, efficient inference, on-device deployment, and product feedback loops.",
  },
];

export const repositories = [
  {
    name: "doculens-ai",
    description: "Citation-first RAG, semantic search, and grounded QA for operational documents.",
    language: "TypeScript + Python",
    license: "MIT",
    href: "https://github.com/CodeWithMoin/doculens-ai",
  },
  {
    name: "EcoGuardian-AI",
    description: "On-device waste classification with React Native and TensorFlow Lite.",
    language: "TypeScript",
    license: "MIT",
    href: "https://github.com/CodeWithMoin/EcoGuardian-AI",
  },
  {
    name: "DatasetOptimizer",
    description: "A small Python utility for reducing image datasets while preserving training utility.",
    language: "Python",
    license: "Public",
    href: "https://github.com/CodeWithMoin/DatasetOptimizer",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
