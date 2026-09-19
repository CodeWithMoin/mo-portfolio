/**
 * A small, real retrieval engine: TF-IDF vectors and cosine similarity over a
 * fixed corpus, computed in the browser with no dependencies and no model call.
 *
 * It is deliberately not a wrapper around an LLM. Everything it returns is
 * arithmetic you can check, which is what makes it honest to show the scoring
 * internals in the lab: `explain()` returns the same numbers `search()` ranks on.
 */

export type Doc = {
  id: string;
  kind: "project" | "role" | "research" | "profile" | "background";
  title: string;
  href?: string;
  /** One-line answer used when this document is the top hit. */
  snippet: string;
  /** Free text that gets indexed. Never rendered directly. */
  body: string;
};

export type Scored = {
  doc: Doc;
  score: number;
  /** Per-term contribution to the dot product, largest first. */
  terms: { term: string; contribution: number }[];
};

/**
 * Closed-class words carry no topical signal but dominate raw term counts.
 * Kept short on purpose — an aggressive list would strip domain words like "not"
 * out of phrases such as "when not to calibrate".
 */
const STOPWORDS = new Set(
  ("a an and are as at be been but by for from had has have he her his how i in is it its me my of on or " +
    "our she that the their them then there these they this to was were what when where which who will with you your")
    .split(" "),
);

/** Cheap suffix folding so "systems" and "system" collide. Not a real stemmer. */
function fold(token: string) {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(fold);
}

export type Index = {
  docs: Doc[];
  /** L2-normalized tf-idf vector per document, keyed by doc id. */
  vectors: Map<string, Map<string, number>>;
  idf: Map<string, number>;
};

export function buildIndex(docs: Doc[]): Index {
  const termFreqs = docs.map((doc) => {
    const counts = new Map<string, number>();
    for (const token of tokenize(`${doc.title} ${doc.body}`)) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
    return counts;
  });

  const docFreq = new Map<string, number>();
  for (const counts of termFreqs) {
    for (const term of counts.keys()) docFreq.set(term, (docFreq.get(term) ?? 0) + 1);
  }

  // Smoothed idf: +1 inside the log keeps a term that appears in every document
  // at a small positive weight rather than exactly zero.
  const idf = new Map<string, number>();
  for (const [term, df] of docFreq) idf.set(term, Math.log((docs.length + 1) / (df + 1)) + 1);

  const vectors = new Map<string, Map<string, number>>();
  docs.forEach((doc, docIndex) => {
    const counts = termFreqs[docIndex];
    const total = [...counts.values()].reduce((sum, n) => sum + n, 0) || 1;
    const vector = new Map<string, number>();
    for (const [term, count] of counts) {
      vector.set(term, (count / total) * (idf.get(term) ?? 1));
    }
    const norm = Math.hypot(...vector.values()) || 1;
    for (const [term, weight] of vector) vector.set(term, weight / norm);
    vectors.set(doc.id, vector);
  });

  return { docs, vectors, idf };
}

/** Same tf-idf treatment as a document, so the cosine is between like vectors. */
function queryVector(index: Index, query: string) {
  const counts = new Map<string, number>();
  for (const token of tokenize(query)) counts.set(token, (counts.get(token) ?? 0) + 1);

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0) || 1;
  const vector = new Map<string, number>();
  for (const [term, count] of counts) {
    vector.set(term, (count / total) * (index.idf.get(term) ?? 1));
  }
  const norm = Math.hypot(...vector.values()) || 1;
  for (const [term, weight] of vector) vector.set(term, weight / norm);
  return vector;
}

export function search(index: Index, query: string, limit = 4): Scored[] {
  const q = queryVector(index, query);
  if (q.size === 0) return [];

  const results: Scored[] = [];
  for (const doc of index.docs) {
    const vector = index.vectors.get(doc.id);
    if (!vector) continue;

    let score = 0;
    const terms: { term: string; contribution: number }[] = [];
    // Both vectors are unit length, so the dot product is the cosine.
    for (const [term, weight] of q) {
      const docWeight = vector.get(term);
      if (!docWeight) continue;
      const contribution = weight * docWeight;
      score += contribution;
      terms.push({ term, contribution });
    }

    if (score > 0) {
      terms.sort((a, b) => b.contribution - a.contribution);
      results.push({ doc, score, terms });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Vocabulary overlap between the query and the corpus, for the lab's read-out. */
export function explain(index: Index, query: string) {
  const tokens = tokenize(query);
  return tokens.map((term) => ({
    term,
    idf: index.idf.get(term) ?? null,
    inVocabulary: index.idf.has(term),
  }));
}
