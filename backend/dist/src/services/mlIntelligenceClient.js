"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blendPeveScore = blendPeveScore;
exports.buildMlPayloadFromAutofill = buildMlPayloadFromAutofill;
exports.fetchMlRepositoryIntelligence = fetchMlRepositoryIntelligence;
const env_1 = require("../config/env");
function blendPeveScore(heuristic, ml) {
    if (ml == null || Number.isNaN(Number(ml)))
        return Math.round(heuristic);
    return Math.round(0.42 * heuristic + 0.58 * Number(ml));
}
function buildMlPayloadFromAutofill(autofill, readmeExcerpt) {
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
async function fetchMlRepositoryIntelligence(autofill, readmeExcerpt) {
    const base = env_1.env.mlServiceUrl?.trim();
    if (!base)
        return null;
    const url = `${base.replace(/\/$/, '')}/v1/repository-intelligence`;
    const body = buildMlPayloadFromAutofill(autofill, readmeExcerpt);
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (env_1.env.mlServiceApiKey)
            headers['X-API-Key'] = env_1.env.mlServiceApiKey;
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 120000);
        const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) {
            const txt = await res.text();
            if (res.status === 401) {
                console.warn('[ml] 401 from ML service — set ML_SERVICE_API_KEY to match the ML service API_KEY (or disable API_KEY on the ML service).');
            }
            else if (res.status === 503) {
                console.warn('[ml] 503 — ML weights may still be loading or failed to load; retry after the first request completes.');
            }
            else {
                console.warn('[ml] HTTP', res.status, txt.slice(0, 200));
            }
            return null;
        }
        return (await res.json());
    }
    catch (e) {
        console.warn('[ml] request failed', e);
        return null;
    }
}
