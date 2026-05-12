/**
 * Repository ingestion + heuristic intelligence for Peve project autofill.
 * Uses GitHub REST API only (no raw code storage). Optional GITHUB_TOKEN raises rate limits.
 */

const GITHUB_API = 'https://api.github.com';

export type ParsedRepo = { owner: string; repo: string; htmlUrl: string };

export function parseGithubRepoUrl(input: string): ParsedRepo | null {
  const raw = (input || '').trim();
  if (!raw) return null;
  try {
    const u = raw.startsWith('http') ? new URL(raw) : new URL(`https://${raw}`);
    const host = u.hostname.replace(/^www\./, '');
    if (host !== 'github.com') {
      return null;
    }
    const parts = u.pathname.replace(/^\//, '').split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    let repo = parts[1];
    if (repo.endsWith('.git')) repo = repo.slice(0, -4);
    return {
      owner,
      repo,
      htmlUrl: `https://github.com/${owner}/${repo}`,
    };
  } catch {
    return null;
  }
}

function githubHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Peve-Repository-Intelligence',
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function ghJson<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, { headers: githubHeaders(token) });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(res.status === 404 ? 'Repository not found or private (token required).' : `GitHub API error (${res.status}): ${err.slice(0, 200)}`);
  }
  return res.json() as Promise<T>;
}

function decodeReadmeBase64(content: string, encoding: string): string {
  if (encoding !== 'base64') return content;
  return Buffer.from(content, 'base64').toString('utf-8');
}

function stripMarkdownRough(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#>*_\-]{1,6}\s?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractFeatureBullets(readme: string): string[] {
  const lines = readme.split(/\r?\n/);
  const out: string[] = [];
  let inFeatures = false;
  for (const line of lines) {
    const h = line.match(/^#{1,3}\s+(.+)/);
    if (h) {
      const title = h[1].toLowerCase();
      inFeatures = /feature|highlights|capabilities|what it does|overview/.test(title);
      continue;
    }
    if (inFeatures && /^[-*]\s+/.test(line.trim())) {
      const t = line.replace(/^[-*]\s+/, '').trim();
      if (t.length > 8 && t.length < 200) out.push(stripMarkdownRough(t));
    }
    if (inFeatures && line.trim() === '') {
      /* keep scanning */
    }
    if (inFeatures && /^#{1,3}\s/.test(line)) {
      inFeatures = false;
    }
    if (out.length >= 8) break;
  }
  return out.slice(0, 8);
}

function inferCategory(topics: string[], description: string, languages: string[]): string {
  const blob = `${topics.join(' ')} ${description} ${languages.join(' ')}`.toLowerCase();
  const rules: [RegExp, string][] = [
    [/tensorflow|pytorch|keras|llm|langchain|openai|huggingface|mlops|model/, 'Machine Learning'],
    [/react|vue|svelte|angular|next\.js|nextjs|vite|webpack|tailwind/, 'Frontend'],
    [/express|fastapi|django|flask|nestjs|spring|graphql|rest api/, 'Backend'],
    [/docker|kubernetes|k8s|terraform|ansible|ci\/cd|github actions/, 'DevOps'],
    [/ios|android|react native|flutter|swiftui|kotlin/, 'Mobile App'],
    [/electron|tauri|qt|wpf/, 'Desktop App'],
    [/mongodb|postgres|mysql|redis|prisma|database/, 'API'],
    [/game|unity|unreal|godot/, 'Game'],
    [/blockchain|solidity|ethereum|web3/, 'Blockchain'],
    [/numpy|pandas|jupyter|notebook|analytics/, 'Data Science'],
    [/arduino|raspberry|sensor|mqtt/, 'IoT'],
  ];
  for (const [re, cat] of rules) {
    if (re.test(blob)) return cat;
  }
  if (languages.includes('TypeScript') || languages.includes('JavaScript')) {
    if (languages.length >= 4) return 'Full Stack';
    return 'Web Application';
  }
  if (languages.includes('Python')) return topics.length ? 'AI/ML' : 'Library';
  return 'Web Application';
}

function inferDifficulty(
  langCount: number,
  sizeKb: number,
  signals: { docker: boolean; ci: boolean; topics: number }
): 'beginner' | 'intermediate' | 'advanced' {
  let score = 0;
  if (langCount >= 4) score += 2;
  else if (langCount >= 2) score += 1;
  if (sizeKb > 5000) score += 2;
  else if (sizeKb > 800) score += 1;
  if (signals.docker) score += 2;
  if (signals.ci) score += 1;
  if (signals.topics >= 5) score += 1;
  if (score >= 5) return 'advanced';
  if (score >= 2) return 'intermediate';
  return 'beginner';
}

function inferDevelopmentStage(
  archived: boolean,
  pushedAt: string,
  openIssues: number,
  stars: number
): 'idea' | 'prototype' | 'ongoing' | 'completed' {
  if (archived) return 'completed';
  const days = (Date.now() - new Date(pushedAt).getTime()) / (1000 * 60 * 60 * 24);
  if (days > 365 && openIssues < 3 && stars > 50) return 'completed';
  if (days > 180) return 'ongoing';
  if (stars < 3 && openIssues < 2) return 'prototype';
  return 'ongoing';
}

export interface CommitTimelineEntry {
  sha: string;
  message: string;
  date: string;
  author?: string;
}

export interface ContributorLeader {
  login: string;
  contributions: number;
  avatarUrl?: string;
}

export interface GithubRepoAutofill {
  title: string;
  tagline: string;
  category: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  developmentStage: 'idea' | 'prototype' | 'ongoing' | 'completed';
  githubRepo: string;
  topics: string[];
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  languageBytes: Record<string, number>;
  watchers: number;
  /** GitHub repository `created_at` (ISO string) */
  repoCreatedAt?: string;
  /** Present on analyze/insights API only — not persisted on Project */
  commitTimeline?: CommitTimelineEntry[];
  contributorLeaders?: ContributorLeader[];
  /** Recent commit subjects (server-built) for ML embedding — not persisted */
  commitMessageSample?: string;
}

export interface RepoInsights extends GithubRepoAutofill {
  htmlUrl: string;
  networkSignals: string[];
  peveScorePreview: number;
  scoreRationale: string;
}

async function tryFetchPackageDeps(owner: string, repo: string, token?: string): Promise<string[]> {
  const names = ['package.json', 'requirements.txt', 'pyproject.toml', 'go.mod', 'Cargo.toml', 'composer.json'];
  const found: string[] = [];
  for (const name of names) {
    try {
      const data = await ghJson<{ content: string; encoding: string }>(
        `/repos/${owner}/${repo}/contents/${encodeURIComponent(name)}`,
        token
      );
      const text = decodeReadmeBase64(data.content, data.encoding);
      if (name === 'package.json') {
        try {
          const j = JSON.parse(text) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
          const keys = [...Object.keys(j.dependencies || {}), ...Object.keys(j.devDependencies || {})].slice(0, 24);
          found.push(...keys);
        } catch {
          /* invalid json */
        }
      } else if (name === 'requirements.txt') {
        text.split('\n').forEach((line) => {
          const m = line.match(/^([a-zA-Z0-9_-]+)/);
          if (m && m[1].length > 1) found.push(m[1]);
        });
      }
    } catch {
      /* missing file */
    }
  }
  return [...new Set(found.map((s) => s.replace(/^@.*\//, '')))].slice(0, 20);
}

export async function fetchGithubRepoActivity(
  owner: string,
  repo: string,
  token?: string
): Promise<{
  commitTimeline: CommitTimelineEntry[];
  contributorLeaders: ContributorLeader[];
  commitMessageSample: string;
}> {
  const commitTimeline: CommitTimelineEntry[] = [];
  const contributorLeaders: ContributorLeader[] = [];
  const commitLines: string[] = [];

  try {
    const commits = await ghJson<
      {
        sha: string;
        commit: { message: string; author?: { name?: string; date?: string } };
      }[]
    >(`/repos/${owner}/${repo}/commits?per_page=25`, token);
    for (const c of commits || []) {
      const firstLine = (c.commit.message || '').split('\n')[0].trim();
      commitTimeline.push({
        sha: (c.sha || '').slice(0, 7),
        message: firstLine.slice(0, 160),
        date: c.commit.author?.date || '',
        author: c.commit.author?.name,
      });
      if (firstLine.length > 4) {
        commitLines.push(firstLine.slice(0, 140));
      }
    }
  } catch {
    /* private repo, rate limit, or no commits */
  }

  try {
    const contribs = await ghJson<{ login: string; contributions: number; avatar_url?: string }[]>(
      `/repos/${owner}/${repo}/contributors?per_page=12`,
      token
    );
    for (const u of contribs || []) {
      contributorLeaders.push({
        login: u.login,
        contributions: u.contributions,
        avatarUrl: u.avatar_url,
      });
    }
  } catch {
    /* ignore */
  }

  const commitMessageSample = commitLines.slice(0, 18).join('\n').slice(0, 4000);

  return { commitTimeline, contributorLeaders, commitMessageSample };
}

export async function fetchGithubRepoAutofill(
  repoUrl: string,
  token?: string
): Promise<{ autofill: GithubRepoAutofill; readmeExcerpt: string }> {
  const parsed = parseGithubRepoUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub repository URL.');

  const repoJson = await ghJson<{
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    default_branch: string;
    topics?: string[];
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    archived: boolean;
    pushed_at: string;
    size: number;
    watchers_count: number;
    created_at?: string;
  }>(`/repos/${parsed.owner}/${parsed.repo}`, token);

  let readme = '';
  try {
    const readmeJson = await ghJson<{ content: string; encoding: string }>(
      `/repos/${parsed.owner}/${parsed.repo}/readme`,
      token
    );
    readme = decodeReadmeBase64(readmeJson.content, readmeJson.encoding);
  } catch {
    readme = '';
  }

  const langs = await ghJson<Record<string, number>>(`/repos/${parsed.owner}/${parsed.repo}/languages`, token);
  const languageBytes = langs || {};
  const languagesSorted = Object.entries(languageBytes)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  const pkgDeps = await tryFetchPackageDeps(parsed.owner, parsed.repo, token);
  const techStack = [...new Set([...languagesSorted.slice(0, 8), ...pkgDeps])].slice(0, 16);

  const topics = repoJson.topics || [];
  const desc = (repoJson.description || '').trim();
  const readmePlain = stripMarkdownRough(readme.slice(0, 12000));
  let description = desc;
  if (readmePlain.length > desc.length + 40) {
    description = `${desc ? `${desc}\n\n` : ''}${readmePlain}`.slice(0, 4000);
  } else if (!description && readmePlain) {
    description = readmePlain.slice(0, 4000);
  }

  const title = repoJson.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const tagline =
    desc ||
    (readmePlain ? readmePlain.slice(0, 140) + (readmePlain.length > 140 ? '…' : '') : `Open-source work on ${repoJson.full_name}`);

  const keyFeatures = extractFeatureBullets(readme);
  if (keyFeatures.length === 0 && topics.length) {
    topics.slice(0, 6).forEach((t) => keyFeatures.push(`Domain focus: ${t}`));
  }

  let docker = false;
  let ci = false;
  try {
    const root = await ghJson<{ name: string }[]>(`/repos/${parsed.owner}/${parsed.repo}/contents`, token);
    const names = new Set(root.map((f) => f.name.toLowerCase()));
    docker = names.has('dockerfile') || names.has('docker-compose.yml') || names.has('docker-compose.yaml');
    ci = names.has('.github');
  } catch {
    /* ignore */
  }

  const category = inferCategory(topics, `${desc} ${readmePlain}`, languagesSorted);
  const difficultyLevel = inferDifficulty(languagesSorted.length, repoJson.size || 0, {
    docker,
    ci,
    topics: topics.length,
  });
  const developmentStage = inferDevelopmentStage(
    repoJson.archived,
    repoJson.pushed_at,
    repoJson.open_issues_count,
    repoJson.stargazers_count
  );

  return {
    autofill: {
      title,
      tagline: tagline.slice(0, 280),
      category,
      description: description.slice(0, 8000),
      keyFeatures,
      techStack,
      difficultyLevel,
      developmentStage,
      githubRepo: parsed.htmlUrl,
      topics,
      stars: repoJson.stargazers_count,
      forks: repoJson.forks_count,
      openIssues: repoJson.open_issues_count,
      defaultBranch: repoJson.default_branch,
      languageBytes,
      watchers: repoJson.watchers_count ?? 0,
      repoCreatedAt: repoJson.created_at,
    },
    readmeExcerpt: readmePlain.slice(0, 8000),
  };
}

export function buildRepositoryInsights(autofill: GithubRepoAutofill, htmlUrl: string): RepoInsights {
  const networkSignals: string[] = [];
  if (autofill.topics.includes('machine-learning') || autofill.techStack.some((t) => /torch|tensorflow|sklearn/i.test(t))) {
    networkSignals.push('AI / ML signals detected in stack or topics');
  }
  if (autofill.techStack.some((t) => /react|vue|svelte|next/i.test(t))) {
    networkSignals.push('Modern frontend ecosystem');
  }
  if (autofill.techStack.some((t) => /express|fastapi|nestjs|django|flask/i.test(t))) {
    networkSignals.push('Application server layer indicated');
  }
  if (autofill.openIssues > 20) networkSignals.push('Active issue surface — evolving product');

  const docQuality = autofill.description.length > 400 ? 12 : 6;
  const diversity = Math.min(18, autofill.techStack.length * 2);
  const community = Math.min(20, Math.floor(Math.log10(autofill.stars + 10) * 6));
  const breadth = Math.min(15, Object.keys(autofill.languageBytes).length * 4);
  const signals = networkSignals.length * 8;
  const peveScorePreview = Math.min(
    100,
    Math.round(28 + docQuality + diversity + community + breadth + signals * 0.5)
  );

  const scoreRationale =
    'Preview score blends documentation depth, stack breadth, community traction, and structural signals from public metadata only.';

  return {
    ...autofill,
    htmlUrl,
    watchers: autofill.watchers,
    networkSignals,
    peveScorePreview,
    scoreRationale,
  };
}
