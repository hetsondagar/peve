import { env } from '../config/env';
import type { GithubRepoAutofill } from './githubRepoAnalysis.service';

export type MLIntelligenceBlock = {
  peve_score_ml: number;
  score_breakdown: {
    architecture: number;
    documentation: number;
    stack_breadth: number;
    community: number;
    innovation: number;
  };
  score_rationale_ml: string;
  project_soul: string[];
  technical_summary: string | null;
  architecture_hints: string[];
  embedding_projection: number[];
  architecture_space?: Array<{ label: string; x: number; y: number; kind: string }>;
  chart_language_mix_png_base64: string | null;
  model_versions: Record<string, string>;
};

export type MlRepositoryIntelligenceResult = {
  intelligence: MLIntelligenceBlock | null;
  /** Set when a request was attempted but no usable intelligence payload was returned. */
  fetchFailure?: string;
};

export function blendPeveScore(heuristic: number, ml: number | null | undefined): number {
  if (ml == null || Number.isNaN(Number(ml))) return Math.round(heuristic);
  return Math.round(0.42 * heuristic + 0.58 * Number(ml));
}

/** User-facing sentence when ML is configured but nothing came back (optional detail from fetch). */
export function formatMlMissingUserMessage(
  context: 'project' | 'analyze',
  fetchFailure?: string,
): string {
  const intro =
    context === 'project'
      ? 'GitHub metadata is loaded, but the ML service did not return intelligence.'
      : 'Repository metadata was loaded, but the ML service did not return intelligence.';
  if (fetchFailure?.trim()) {
    return `${intro} ${fetchFailure.trim()}`;
  }
  return `${intro} Check ML_SERVICE_URL (no trailing path), cold start (first request can take 1–2 minutes — retry), and ML_SERVICE_API_KEY vs the ML service API_KEY if keys are enforced.`;
}

export function buildMlPayloadFromAutofill(
  autofill: GithubRepoAutofill,
  readmeExcerpt: string
): Record<string, unknown> {
  return {
    repo_url: autofill.githubRepo,
    readme_excerpt: readmeExcerpt.slice(0, 8000),
    description: (autofill.description || '').slice(0, 8000),
    languages: autofill.languageBytes || {},
    topics: autofill.topics || [],
    stars: autofill.stars ?? 0,
    forks: autofill.forks ?? 0,
    open_issues: autofill.openIssues ?? 0,
    default_branch: autofill.defaultBranch || 'main',
    key_features: autofill.keyFeatures || [],
    tech_stack: autofill.techStack || [],
    category: autofill.category || '',
    difficulty_level: autofill.difficultyLevel || '',
    development_stage: autofill.developmentStage || '',
    commit_messages_sample: autofill.commitMessageSample || '',
  };
}

const parsedTimeout = Number(process.env.ML_FETCH_TIMEOUT_MS);
const ML_TIMEOUT_MS = Number.isFinite(parsedTimeout)
  ? Math.min(Math.max(parsedTimeout, 30_000), 300_000)
  : 120_000;

export async function fetchMlRepositoryIntelligence(
  autofill: GithubRepoAutofill,
  readmeExcerpt: string
): Promise<MlRepositoryIntelligenceResult> {
  const base = env.mlServiceUrl?.trim();
  if (!base) return { intelligence: null };

  const url = `${base.replace(/\/$/, '')}/v1/repository-intelligence`;
  const body = buildMlPayloadFromAutofill(autofill, readmeExcerpt);
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (env.mlServiceApiKey) headers['X-API-Key'] = env.mlServiceApiKey;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ML_TIMEOUT_MS);
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      const snippet = txt.replace(/\s+/g, ' ').slice(0, 160).trim();

      let fetchFailure = `The ML service returned HTTP ${res.status}.`;
      if (res.status === 401) {
        fetchFailure +=
          ' Unauthorized: set ML_SERVICE_API_KEY on this API to match the ML service API_KEY, or remove API_KEY on the ML service.';
      } else if (res.status === 502) {
        fetchFailure +=
          ' Bad gateway: the ML host is down, sleeping (wake it with GET /health on the ML URL), overloaded, or the URL is wrong.';
      } else if (res.status === 503) {
        fetchFailure +=
          ' Unavailable: models may still be loading on first request — wait 60s and retry.';
      } else if (res.status === 504) {
        fetchFailure +=
          ' Gateway timeout: ML cold start may exceed the proxy limit; retry after the ML service is warm or use a larger instance.';
      } else if (snippet) {
        fetchFailure += ` Body: ${snippet}`;
      }

      console.warn('[ml]', fetchFailure);
      return { intelligence: null, fetchFailure };
    }

    let raw: unknown;
    try {
      raw = await res.json();
    } catch {
      const fetchFailure = 'The ML service returned a non-JSON response.';
      console.warn('[ml]', fetchFailure);
      return { intelligence: null, fetchFailure };
    }

    if (
      !raw ||
      typeof raw !== 'object' ||
      typeof (raw as { peve_score_ml?: unknown }).peve_score_ml !== 'number'
    ) {
      const fetchFailure =
        'The ML service JSON did not include a numeric peve_score_ml (wrong endpoint or incompatible version).';
      console.warn('[ml]', fetchFailure);
      return { intelligence: null, fetchFailure };
    }

    return { intelligence: raw as MLIntelligenceBlock };
  } catch (e: unknown) {
    const name = e instanceof Error ? e.name : '';
    const msg = e instanceof Error ? e.message : String(e);
    let fetchFailure = `Request to ML service failed: ${msg}`;
    if (name === 'AbortError') {
      fetchFailure = `Request to ML service timed out after ${ML_TIMEOUT_MS / 1000}s (cold start can be slow). Set ML_FETCH_TIMEOUT_MS (max 300000) on this API or retry once the ML service is warm.`;
    }
    console.warn('[ml]', fetchFailure, e);
    return { intelligence: null, fetchFailure };
  }
}
