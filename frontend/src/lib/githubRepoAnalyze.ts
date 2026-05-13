/**
 * Normalizes POST /api/projects/analyze-github-repo responses so autofill works
 * whether the client receives `{ success, data }` or a legacy flat shape.
 */

export type GithubAnalyzeIntelligence = {
  peve_score_ml?: number;
  score_rationale_ml?: string;
  technical_summary?: string | null;
  architecture_hints?: string[];
  project_soul?: string[];
  score_breakdown?: Record<string, number>;
};

export type GithubAnalyzePayload = {
  title: string;
  tagline: string;
  category: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  difficultyLevel: string;
  developmentStage: string;
  githubRepo: string;
  topics?: string[];
  intelligence?: GithubAnalyzeIntelligence | null;
  commitTimeline?: { sha: string; message: string; date: string; author?: string }[];
  contributorLeaders?: { login: string; contributions: number; avatarUrl?: string }[];
};

export function payloadFromAnalyzeGithubResponse(res: unknown): GithubAnalyzePayload | null {
  if (!res || typeof res !== 'object') return null;
  const r = res as Record<string, unknown>;
  const inner = r.data;
  if (inner && typeof inner === 'object' && 'githubRepo' in (inner as object)) {
    return inner as GithubAnalyzePayload;
  }
  if ('githubRepo' in r && typeof (r as GithubAnalyzePayload).githubRepo === 'string') {
    return r as GithubAnalyzePayload;
  }
  return null;
}

/** Enrich listing fields with ML layer when they add signal and the user did not lock the field. */
export function applyIntelligenceToAutofillFields(
  base: {
    description: string;
    keyFeatures: string[];
    tagline: string;
  },
  intelligence: GithubAnalyzeIntelligence | null | undefined,
  locks: { description: boolean; keyFeatures: boolean; tagline: boolean },
): { description: string; keyFeatures: string[]; tagline: string } {
  let { description, keyFeatures, tagline } = base;
  const intel = intelligence;

  if (!locks.tagline && intel?.project_soul?.length) {
    const first = intel.project_soul[0]?.trim();
    if (first && (!tagline.trim() || tagline.length < 24)) {
      tagline = first.slice(0, 280);
    }
  }

  if (!locks.description && intel?.technical_summary?.trim()) {
    const ts = intel.technical_summary.trim();
    const desc = description.trim();
    if (!desc) {
      description = ts;
    } else if (!desc.includes(ts.slice(0, Math.min(48, ts.length)))) {
      description = `${desc}\n\n— From repository analysis —\n${ts}`.slice(0, 12000);
    }
  }

  if (!locks.keyFeatures && intel?.architecture_hints?.length) {
    const next = [...keyFeatures];
    for (const h of intel.architecture_hints.slice(0, 6)) {
      const t = h.trim();
      if (!t) continue;
      if (!next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t);
    }
    keyFeatures = next.slice(0, 24);
  }

  return { description, keyFeatures, tagline };
}
