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
  chart_language_mix_png_base64: string | null;
  model_versions: Record<string, string>;
};

export function blendPeveScore(heuristic: number, ml: number | null | undefined): number {
  if (ml == null || Number.isNaN(Number(ml))) return Math.round(heuristic);
  return Math.round(0.42 * heuristic + 0.58 * Number(ml));
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

export async function fetchMlRepositoryIntelligence(
  autofill: GithubRepoAutofill,
  readmeExcerpt: string
): Promise<MLIntelligenceBlock | null> {
  const base = env.mlServiceUrl?.trim();
  if (!base) return null;
  const url = `${base.replace(/\/$/, '')}/v1/repository-intelligence`;
  const body = buildMlPayloadFromAutofill(autofill, readmeExcerpt);
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (env.mlServiceApiKey) headers['X-API-Key'] = env.mlServiceApiKey;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 120_000);
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      const txt = await res.text();
      console.warn('[ml] HTTP', res.status, txt.slice(0, 200));
      return null;
    }
    return (await res.json()) as MLIntelligenceBlock;
  } catch (e) {
    console.warn('[ml] request failed', e);
    return null;
  }
}
