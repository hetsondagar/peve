/**
 * Public developer portfolio / "Project Soul" showcase — one URL per project.
 * Data: Peve project document + live repository-insights (GitHub metadata + ML when configured).
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Sparkles,
  Layers,
  GitCommit,
  Users,
  Zap,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  Cell,
  ZAxis,
} from 'recharts';
import { NetworkBackground } from '@/components/NetworkBackground';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiFetch } from '@/lib/api';

type Intel = {
  peveScorePreview?: number;
  stars?: number;
  forks?: number;
  openIssues?: number;
  watchers?: number;
  defaultBranch?: string;
  commitTimeline?: { sha: string; message: string; date: string; author?: string }[];
  contributorLeaders?: { login: string; contributions: number; avatarUrl?: string }[];
  intelligence?: {
    peve_score_ml?: number;
    technical_summary?: string | null;
    score_rationale_ml?: string;
    architecture_hints?: string[];
    project_soul?: string[];
    score_breakdown?: Record<string, number>;
    chart_language_mix_png_base64?: string | null;
    embedding_projection?: number[];
    architecture_space?: Array<{ label: string; x: number; y: number; kind: string }>;
  };
  semantic_neighbors?: Array<{
    repo_url: string;
    title: string;
    tagline: string;
    category: string;
    similarity: number;
  }>;
  topics?: string[];
  techStack?: string[];
};

function productSummary(description: string, tagline: string): string {
  const d = (description || '').trim();
  if (!d) return tagline || 'Product narrative will sharpen as the README and shipped surfaces grow.';
  const parts = d.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, 2).join(' ') || d.slice(0, 320);
}

function architectureNarrative(intel: Intel | null, category: string): string {
  const hints = intel?.intelligence?.architecture_hints || [];
  if (hints.length)
    return hints.slice(0, 4).join(' ');
  const cat = category || 'application';
  return `From declared metadata, this reads as a ${cat.toLowerCase()} with engineering choices visible through topics, stack, and repository signals rather than raw source inspection.`;
}

function architectureSpaceColor(kind: string): string {
  switch (kind) {
    case 'repo':
      return '#2dd4bf';
    case 'topic':
      return '#a78bfa';
    case 'tech':
      return '#38bdf8';
    case 'anchor':
      return '#64748b';
    default:
      return '#94a3b8';
  }
}

function strongestDecision(intel: Intel | null): string {
  const b = intel?.intelligence?.score_breakdown;
  if (!b) return 'Signals are still converging — publish richer topics and README sections to surface decisive patterns.';
  const top = Object.entries(b).sort((a, c) => Number(c[1]) - Number(a[1]))[0];
  const label = top[0].replace(/_/g, ' ');
  return `Strongest signal in the scoring blend: ${label} — this dimension currently carries the most differentiated weight in the model-assisted view.`;
}

export default function ProjectShowcase() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [insights, setInsights] = useState<Intel | null>(null);
  const [insightMsg, setInsightMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const projJson = (await apiFetch(`/api/projects/${id}`)) as {
          data?: { project?: unknown };
          success?: boolean;
          error?: string;
        };
        if (!projJson.data?.project) throw new Error('Project not found');
        if (cancelled) return;
        setProject(projJson.data.project as any);
        try {
          const ir = (await apiFetch(`/api/projects/${id}/repository-insights`)) as {
            data?: Intel | null;
            message?: string;
          };
          if (!cancelled) {
            setInsights(ir.data ?? null);
            setInsightMsg(typeof ir.message === 'string' ? ir.message : '');
          }
        } catch {
          if (!cancelled) {
            setInsights(null);
            setInsightMsg('Repository insights require a linked public GitHub repo or access permissions.');
          }
        }
      } catch (e: unknown) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Failed to load showcase');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const techChartData = useMemo(() => {
    const stack = (project?.techStack as string[] | undefined) || insights?.techStack || [];
    return stack.slice(0, 12).map((name, i) => ({ name: name.length > 14 ? `${name.slice(0, 12)}…` : name, weight: 12 - (i % 4) }));
  }, [project, insights]);

  const radarData = useMemo(() => {
    const b = insights?.intelligence?.score_breakdown;
    if (!b) return [];
    return Object.entries(b).map(([k, v]) => ({
      axis: k.replace(/_/g, ' '),
      value: Math.min(100, Math.max(0, Number(v))),
    }));
  }, [insights]);

  const embeddingBars = useMemo(() => {
    const p = insights?.intelligence?.embedding_projection;
    if (!p?.length) return [];
    return p.map((value, i) => ({ name: `d${i + 1}`, value }));
  }, [insights]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/showcase/${id}` : '';

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="relative z-10 flex min-h-screen items-center justify-center text-muted-foreground">
          Loading showcase…
        </div>
      </div>
    );
  }

  if (err || !project) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg text-foreground">{err || 'Project unavailable'}</p>
          <Link to="/login" className="text-primary hover:underline">
            Sign in to Peve
          </Link>
        </div>
      </div>
    );
  }

  const intel = insights?.intelligence;
  const soul = intel?.project_soul?.length ? intel.project_soul : [];

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <NetworkBackground />
      {/* Hero animated backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -left-1/4 top-0 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[120px]"
          animate={{ opacity: [0.35, 0.55, 0.35], x: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-1/4 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[100px]"
          animate={{ opacity: [0.25, 0.45, 0.25], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
          <div className="flex flex-wrap gap-2">
            <GlowButton type="button" variant="outline" size="sm" className="gap-2 bg-card" onClick={() => void copyShare()}>
              <Share2 className="h-4 w-4" />
              Copy share link
            </GlowButton>
            {project.links?.githubRepo && (
              <GlowButton type="button" variant="outline" size="sm" className="gap-2 bg-card" asChild>
                <a href={project.links.githubRepo} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  GitHub
                </a>
              </GlowButton>
            )}
          </div>
        </div>

        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl sm:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10" />
          <div className="relative space-y-4">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              Peve showcase
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
            <p className="max-w-3xl text-xl text-muted-foreground">{project.tagline}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge variant="secondary">{project.category}</Badge>
              {typeof intel?.peve_score_ml === 'number' && (
                <Badge className="bg-secondary/80 text-secondary-foreground">
                  ML score {intel.peve_score_ml.toFixed(0)}/100
                </Badge>
              )}
              {typeof insights?.peveScorePreview === 'number' && (
                <Badge variant="outline">Heuristic preview {Math.round(insights.peveScorePreview)}/100</Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {project.developmentStage}
              </Badge>
            </div>
            <p className="max-w-2xl pt-4 font-mono text-xs text-muted-foreground break-all">{shareUrl}</p>
          </div>
        </motion.header>

        {/* AI summary */}
        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <Card className="border-border bg-card shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                AI summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Technical</h3>
                <p>{intel?.technical_summary || project.description?.slice(0, 900) || '—'}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Product</h3>
                <p>{productSummary(project.description || '', project.tagline || '')}</p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-foreground">Architecture read</h3>
                <p>{architectureNarrative(insights, project.category)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Stars', v: insights?.stars ?? 0 },
                    { name: 'Forks', v: insights?.forks ?? 0 },
                    { name: 'Issues', v: insights?.openIssues ?? 0 },
                  ]}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0f1419', border: '1px solid #2a3340' }} />
                  <Bar dataKey="v" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Tech + radar */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Tech stack
              </CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {techChartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={techChartData} layout="vertical" margin={{ left: 8, right: 16 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#0f1419', border: '1px solid #2a3340' }} />
                    <Bar dataKey="weight" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">Add technologies on the project to populate this view.</p>
              )}
            </CardContent>
          </Card>
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Score dimensions</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {radarData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2a3340" />
                    <PolarAngleAxis dataKey="axis" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="value" stroke="#2dd4bf" fill="#2dd4bf" fillOpacity={0.35} />
                    <Tooltip contentStyle={{ background: '#0f1419', border: '1px solid #2a3340' }} />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {insightMsg ||
                    'Score dimensions come from the ML service (RandomForest score head over repository signals). Link GitHub on the project and set ML_SERVICE_URL on the API so this radar can populate.'}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Architecture space (SentenceTransformer + PCA from ML service) */}
        <section className="mt-12">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Architecture space</CardTitle>
              <p className="text-xs text-muted-foreground">
                2D PCA of the same embedding model used for scoring: repository README, topics, technologies, and
                fixed semantic anchors — no LLM, no template flow diagram.
              </p>
            </CardHeader>
            <CardContent className="h-80">
              {intel?.architecture_space && intel.architecture_space.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="PC1"
                      stroke="#94a3b8"
                      fontSize={11}
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="PC2"
                      stroke="#94a3b8"
                      fontSize={11}
                      domain={['auto', 'auto']}
                    />
                    <ZAxis range={[90, 90]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null;
                        const p = payload[0].payload as { label: string; kind: string };
                        return (
                          <div className="rounded-md border border-border bg-card px-2 py-1 text-xs shadow-md">
                            <p className="font-semibold text-foreground">{p.label}</p>
                            <p className="capitalize text-muted-foreground">{p.kind}</p>
                          </div>
                        );
                      }}
                    />
                    <Scatter data={intel.architecture_space}>
                      {intel.architecture_space.map((pt, i) => (
                        <Cell key={`${pt.label}-${i}`} fill={architectureSpaceColor(pt.kind)} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {insightMsg ||
                    'This map is built from SentenceTransformer embeddings and PCA in the ML service. Ensure the project has a GitHub URL and the API has ML_SERVICE_URL pointed at a healthy Peve ML deployment.'}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Engineering insights */}
        <section className="mt-12">
          <Card className="border-border bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Engineering insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>{strongestDecision(insights)}</p>
              {intel?.score_rationale_ml && <p>{intel.score_rationale_ml}</p>}
              <ul className="space-y-2 border-l-2 border-primary/30 pl-4">
                {(intel?.architecture_hints || []).map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Timeline */}
        {insights?.commitTimeline && insights.commitTimeline.length > 0 && (
          <section className="mt-12">
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitCommit className="h-5 w-5 text-primary" />
                  Recent evolution (commits)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {insights.commitTimeline.slice(0, 12).map((c, i) => (
                    <li key={`${c.sha}-${i}`} className="flex gap-4 border-l-2 border-border pl-4">
                      <span className="font-mono text-xs text-primary">{c.sha}</span>
                      <div>
                        <p className="text-sm text-foreground">{c.message}</p>
                        <p className="text-xs text-muted-foreground">{c.date ? new Date(c.date).toLocaleString() : ''}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Project soul — signature section */}
        <section className="mt-12">
          <Card className="border-2 border-primary/30 bg-card shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-7 w-7 text-primary" />
                Project soul
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {soul.length ? (
                soul.map((line, i) => (
                  <motion.blockquote
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="border-l-4 border-cyan-500/60 bg-muted/40 py-4 pl-5 pr-4 text-base italic leading-relaxed text-foreground/95"
                  >
                    {line}
                  </motion.blockquote>
                ))
              ) : (
                <p className="text-muted-foreground">
                  {insightMsg ||
                    'Project soul lines are generated by the ML service (embedding similarity to archetypes — no LLM). Link a public GitHub repo on the project and configure ML_SERVICE_URL on the Peve API.'}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Embedding preview + language chart */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {embeddingBars.length > 0 && (
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Embedding projection</CardTitle>
              </CardHeader>
              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={embeddingBars}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ background: '#0f1419', border: '1px solid #2a3340' }} />
                    <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {intel?.chart_language_mix_png_base64 && (
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Language mix</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={`data:image/png;base64,${intel.chart_language_mix_png_base64}`}
                  alt="Language mix"
                  className="max-h-64 w-full rounded-lg object-contain"
                />
              </CardContent>
            </Card>
          )}
        </section>

        {/* Contributors + neighbors */}
        <section className="mt-12 grid gap-6 lg:grid-cols-2">
          {insights?.contributorLeaders && insights.contributorLeaders.length > 0 && (
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Contributors (GitHub)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {insights.contributorLeaders.slice(0, 10).map((c) => (
                    <li key={c.login} className="flex justify-between border-b border-border/60 py-2">
                      <span>@{c.login}</span>
                      <span className="text-muted-foreground">{c.contributions} commits</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {insights?.semantic_neighbors && insights.semantic_neighbors.length > 0 && (
            <Card className="border-border bg-card shadow-lg">
              <CardHeader>
                <CardTitle>Semantic neighbors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.semantic_neighbors.map((n, i) => (
                  <a
                    key={`${n.repo_url}-${i}`}
                    href={n.repo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-border bg-muted/30 p-3 text-sm transition-colors hover:border-primary/40"
                  >
                    <p className="font-semibold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.category}</p>
                    <p className="mt-1 text-xs text-primary">Similarity {Number(n.similarity).toFixed(2)}</p>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </section>

        <footer className="mt-16 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          Unique showcase for <span className="text-foreground">{project.title}</span> · Generated by Peve from public
          metadata and optional ML layers.
        </footer>
      </div>
    </div>
  );
}
