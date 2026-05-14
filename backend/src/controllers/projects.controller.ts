import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { CollaborationRequest } from '../models/CollaborationRequest';
import { Notification } from '../models/Notification';
import { BadgeService } from '../services/badgeService';
import {
  fetchGithubRepoAutofill,
  buildRepositoryInsights,
  parseGithubRepoUrl,
  fetchGithubRepoActivity,
} from '../services/githubRepoAnalysis.service';
import { env } from '../config/env';
import {
  blendPeveScore,
  fetchMlRepositoryIntelligence,
  formatMlMissingUserMessage,
  type MLIntelligenceBlock,
} from '../services/mlIntelligenceClient';
import { stripEphemeralProjectFields } from '../utils/projectPayloadSanitize';

function clampScore(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function hashToUnit(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

function buildFallbackArchitectureSpace(
  repoLabel: string,
  topics: string[],
  techStack: string[],
): Array<{ label: string; x: number; y: number; kind: string }> {
  const points: Array<{ label: string; x: number; y: number; kind: string }> = [];
  const pushPoint = (label: string, kind: string) => {
    const x = (hashToUnit(`${kind}:${label}:x`) - 0.5) * 8;
    const y = (hashToUnit(`${kind}:${label}:y`) - 0.5) * 8;
    points.push({ label, x: Number(x.toFixed(3)), y: Number(y.toFixed(3)), kind });
  };
  pushPoint(repoLabel || 'Repository', 'repo');
  topics.slice(0, 8).forEach((t) => pushPoint(`#${t}`, 'topic'));
  techStack.slice(0, 8).forEach((t) => pushPoint(t, 'tech'));
  ['reliability', 'velocity', 'complexity'].forEach((a) => pushPoint(a, 'anchor'));
  return points;
}

function buildFallbackIntelligence(
  baseInsights: Record<string, any>,
  readmeExcerpt: string,
  commitTimeline: Array<{ message?: string }> = [],
): MLIntelligenceBlock {
  const topics: string[] = Array.isArray(baseInsights.topics) ? baseInsights.topics : [];
  const techStack: string[] = Array.isArray(baseInsights.techStack) ? baseInsights.techStack : [];
  const desc = String(baseInsights.description || '').trim();
  const readme = String(readmeExcerpt || '').trim();
  const commits = commitTimeline.map((c) => String(c?.message || '').trim()).filter(Boolean);
  const hasTestsSignal = /(test|jest|vitest|pytest|mocha|cypress)/i.test(
    `${techStack.join(' ')} ${readme} ${commits.join(' ')}`,
  );
  const hasCiSignal = /(github actions|ci|pipeline|workflow)/i.test(readme);
  const hasContainerSignal = /(docker|kubernetes|compose)/i.test(`${readme} ${techStack.join(' ')}`);
  const hasApiSignal = /(api|graphql|rest|endpoint)/i.test(`${desc} ${readme}`);

  const scoreBreakdown = {
    architecture: clampScore(40 + topics.length * 5 + (hasApiSignal ? 8 : 0)),
    documentation: clampScore(30 + Math.min(45, Math.floor(readme.length / 120))),
    stack_breadth: clampScore(25 + techStack.length * 6),
    community: clampScore(20 + Math.log10((Number(baseInsights.stars) || 0) + 10) * 22),
    innovation: clampScore(35 + (topics.length >= 5 ? 12 : 0) + (hasContainerSignal ? 8 : 0)),
  };

  const technicalSummary = [
    `Repository profile: ${baseInsights.category || 'Application'} built around ${techStack.slice(0, 5).join(', ') || 'the declared stack'}.`,
    `Signals: ${topics.length} topic tags, ${Object.keys(baseInsights.languageBytes || {}).length} primary language buckets, ${Number(baseInsights.stars) || 0} stars, and ${Number(baseInsights.openIssues) || 0} open issues.`,
    commits.length
      ? `Recent change trajectory: ${commits.slice(0, 5).join(' | ')}.`
      : 'Recent change trajectory: commit metadata is limited, so trend confidence is moderate.',
  ].join('\n\n');

  const architectureHints = [
    hasApiSignal
      ? 'API surface is an explicit architectural boundary; document contract/versioning expectations in README.'
      : 'Define core module boundaries explicitly (domain, application, infrastructure) to tighten architecture narrative.',
    hasTestsSignal
      ? 'Testing/tooling signals are present; publish scope (unit/integration/e2e) to improve maintainability confidence.'
      : 'Testing evidence is weak in metadata; add test strategy and commands to increase reliability signal.',
    hasCiSignal
      ? 'CI/workflow traces are visible; include quality gates and deployment policy in docs for stronger operability signal.'
      : 'No clear CI/workflow signal from metadata; adding pipeline docs will improve delivery confidence.',
    hasContainerSignal
      ? 'Containerization signal exists; add runtime topology (services, ports, storage) for clearer deployment architecture.'
      : 'Runtime packaging is unclear; include local/prod environment topology to reduce onboarding ambiguity.',
  ];

  const projectSoul = [
    `This project behaves like a ${String(baseInsights.developmentStage || 'live')} system: it is being shaped by frequent iteration rather than static documentation.`,
    `Its center of gravity is ${topics.slice(0, 3).join(', ') || 'pragmatic product delivery'}, with engineering decisions encoded more in stack and commit flow than marketing language.`,
    `The strongest maintainability lever now is tightening architectural docs around ${techStack.slice(0, 3).join(', ') || 'core modules'} and release workflow.`,
  ];

  return {
    peve_score_ml: clampScore((Number(baseInsights.peveScorePreview) || 60) + 4),
    score_breakdown: scoreBreakdown,
    score_rationale_ml:
      'Traditional local scoring fallback: deterministic heuristics over repository metadata, README text, commit subjects, and stack signals (no external LLM call).',
    project_soul: projectSoul,
    technical_summary: technicalSummary,
    architecture_hints: architectureHints,
    embedding_projection: [0.83, 0.69, 0.55, 0.61, 0.47, 0.58].map((v, i) =>
      Number((v + (hashToUnit(`${baseInsights.title || 'repo'}:${i}`) - 0.5) * 0.08).toFixed(3)),
    ),
    architecture_space: buildFallbackArchitectureSpace(baseInsights.title || 'Repository', topics, techStack),
    chart_language_mix_png_base64: null,
    model_versions: { fallback: 'heuristic-v1' },
  };
}

function mergeWithFallbackIntelligence(
  primary: MLIntelligenceBlock | null,
  fallback: MLIntelligenceBlock,
): MLIntelligenceBlock {
  if (!primary) return fallback;
  return {
    ...primary,
    technical_summary: primary.technical_summary?.trim() || fallback.technical_summary,
    architecture_hints:
      Array.isArray(primary.architecture_hints) && primary.architecture_hints.length
        ? primary.architecture_hints
        : fallback.architecture_hints,
    project_soul:
      Array.isArray(primary.project_soul) && primary.project_soul.length
        ? primary.project_soul
        : fallback.project_soul,
    architecture_space:
      Array.isArray(primary.architecture_space) && primary.architecture_space.length
        ? primary.architecture_space
        : fallback.architecture_space,
    embedding_projection:
      Array.isArray(primary.embedding_projection) && primary.embedding_projection.length
        ? primary.embedding_projection
        : fallback.embedding_projection,
    score_rationale_ml: primary.score_rationale_ml?.trim() || fallback.score_rationale_ml,
    model_versions: { ...(fallback.model_versions || {}), ...(primary.model_versions || {}) },
  };
}

export async function analyzeGithubRepository(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const { repoUrl } = req.body || {};
    if (!repoUrl || typeof repoUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'repoUrl is required' });
    }
    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_REPO_ANALYSIS_TOKEN || '';
    const { autofill, readmeExcerpt } = await fetchGithubRepoAutofill(repoUrl, token || undefined);
    const parsed = parseGithubRepoUrl(autofill.githubRepo);
    const activity = parsed
      ? await fetchGithubRepoActivity(parsed.owner, parsed.repo, token || undefined)
      : { commitTimeline: [], contributorLeaders: [], commitMessageSample: '' };
    const autofillForMl = {
      ...autofill,
      commitMessageSample: activity.commitMessageSample,
    };
    const { intelligence, fetchFailure } = await fetchMlRepositoryIntelligence(autofillForMl, readmeExcerpt);
    const fallbackIntel = buildFallbackIntelligence(
      { ...autofill, peveScorePreview: 65 },
      readmeExcerpt,
      activity.commitTimeline,
    );
    const resolvedIntel = mergeWithFallbackIntelligence(intelligence, fallbackIntel);
    const mlUrlConfigured = Boolean(env.mlServiceUrl?.trim());
    const mlMessage =
      intelligence == null
        ? mlUrlConfigured
          ? formatMlMissingUserMessage('analyze', fetchFailure)
          : 'Set ML_SERVICE_URL on this API to your Peve ML service base URL (SentenceTransformers + sklearn; no LLM API key required).'
        : undefined;
    const data = {
      ...autofill,
      ...activity,
      intelligence: resolvedIntel,
    };
    return res.json({
      success: true,
      data,
      ...(mlMessage ? { message: mlMessage } : {}),
    });
  } catch (error: any) {
    console.error('analyzeGithubRepository:', error);
    return res.status(400).json({
      success: false,
      error: error?.message || 'Failed to analyze repository',
    });
  }
}

export async function getRepositoryInsights(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const viewerId = (req as any).user?.id;
    const isAuthor = viewerId && String(project.author) === String(viewerId);
    if (project.visibility === 'private' && !isAuthor) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    if (project.visibility === 'friends-only' && !isAuthor) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    const repoUrl = project.links?.githubRepo;
    if (!repoUrl || !parseGithubRepoUrl(repoUrl)) {
      return res.json({
        success: true,
        data: null,
        message:
          'Add a GitHub repository URL to this project to unlock repository intelligence.',
      });
    }

    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_REPO_ANALYSIS_TOKEN || '';
    const { autofill, readmeExcerpt } = await fetchGithubRepoAutofill(repoUrl, token || undefined);
    const parsed = parseGithubRepoUrl(autofill.githubRepo);
    const activity = parsed
      ? await fetchGithubRepoActivity(parsed.owner, parsed.repo, token || undefined)
      : { commitTimeline: [], contributorLeaders: [], commitMessageSample: '' };
    const autofillForMl = {
      ...autofill,
      commitMessageSample: activity.commitMessageSample,
    };
    const baseInsights = buildRepositoryInsights(autofill, autofill.githubRepo);
    const { intelligence, fetchFailure } = await fetchMlRepositoryIntelligence(autofillForMl, readmeExcerpt);
    const fallbackIntel = buildFallbackIntelligence(baseInsights, readmeExcerpt, activity.commitTimeline);
    const resolvedIntel = mergeWithFallbackIntelligence(intelligence, fallbackIntel);

    let data: Record<string, unknown> = {
      ...baseInsights,
      ...activity,
      intelligence: resolvedIntel,
    };
    if (resolvedIntel) {
      data = {
        ...data,
        peveScorePreview: blendPeveScore(baseInsights.peveScorePreview, resolvedIntel.peve_score_ml),
        scoreRationale: `${baseInsights.scoreRationale} Blended with ML repository intelligence (embeddings + tabular scoring).`,
      };
    }

    const mlUrlConfigured = Boolean(env.mlServiceUrl?.trim());
    const message =
      intelligence == null
        ? mlUrlConfigured
          ? formatMlMissingUserMessage('project', fetchFailure)
          : 'GitHub is linked. Set ML_SERVICE_URL on this API to the base URL of your Peve ML service (traditional ML: SentenceTransformers + sklearn — no LLM API key required).'
        : undefined;

    return res.json({ success: true, data, ...(message ? { message } : {}) });
  } catch (error: any) {
    console.error('getRepositoryInsights:', error);
    return res.status(400).json({
      success: false,
      error: error?.message || 'Failed to load repository insights',
    });
  }
}

export async function listProjects(req: Request, res: Response) {
  try {
    const { 
      page = '1', 
      limit = '20', 
      tech, 
      author, 
      status, 
      featured, 
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query as any;
    
    const q: any = { visibility: 'public', isDraft: false };
    
    if (tech) q.techStack = { $in: String(tech).split(',') };
    if (author) q.author = author;
    if (status) q.status = status;
    if (featured === 'true') q.featured = true;
    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { keyFeatures: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const cursor = Project.find(q)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
      
    const [items, total] = await Promise.all([cursor, Project.countDocuments(q)]);
    
    return res.json({ 
      success: true, 
      data: { 
        items, 
        total, 
        page: Number(page), 
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      } 
    });
  } catch (error) {
    console.error('List projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
}

export async function getProjectsByContributor(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    
    // Get projects where user is a contributor
    const projects = await Project.find({
      'contributors.user': userId,
      visibility: 'public',
      isDraft: false
    })
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills')
      .sort({ createdAt: -1 });
    
    // Add collaborator flag to each project
    const projectsWithFlag = projects.map(project => ({
      ...project.toObject(),
      isCollaborator: true
    }));
    
    return res.json({
      success: true,
      data: { projects: projectsWithFlag }
    });
  } catch (error) {
    console.error('Get projects by contributor error:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
}

export async function getProject(req: Request, res: Response) {
  try {
    const project = await Project.findById(req.params.id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Increment view count
    await Project.findByIdAndUpdate(req.params.id, {
      $inc: { 'metrics.views': 1 }
    });
    
    // Get comments for this project
    const comments = await Comment.find({
      targetType: 'project',
      targetId: req.params.id
    })
      .populate('author', 'username name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(20);
    
    return res.json({ 
      success: true, 
      data: { 
        project, 
        comments 
      } 
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch project' });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Validate required fields
    const { title, tagline, description, category, links } = req.body;
    if (!title || !tagline || !description || !category || !links?.githubRepo) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: title, tagline, description, category, and githubRepo are required' 
      });
    }

    // Process contributors and teammates (loose shape from client; strip analyze-only keys)
    const projectData = { ...req.body } as Record<string, any>;
    stripEphemeralProjectFields(projectData as Record<string, unknown>);
    
    // Initialize contributors array
    projectData.contributors = [];
    
    // Handle contributors (from frontend collaborators field)
    if (projectData.collaborators && Array.isArray(projectData.collaborators) && projectData.collaborators.length > 0) {
      const contributors = projectData.collaborators
        .map((c: any) => {
          if (c && typeof c === 'object') {
            const name = (c.name || '').trim();
            const role = (c.role || '').trim();
            if (name) {
              return { name, role: role || 'Contributor', contributions: 'Project contributor' };
            }
          } else if (typeof c === 'string') {
            const name = c.trim();
            if (name) return { name, role: 'Contributor', contributions: 'Project contributor' };
          }
          return null;
        })
        .filter(Boolean);
      projectData.contributors = contributors as any;
    }
    
    // Remove collaborators field to avoid conflicts with schema
    delete projectData.collaborators;

    // Handle collaboration teammates
    if (projectData.collaboration?.teammates && Array.isArray(projectData.collaboration.teammates) && projectData.collaboration.teammates.length > 0) {
      // Validate that all teammates exist as users
      const validTeammates = [] as any[];
      for (const teammate of projectData.collaboration.teammates) {
        // Handle both string usernames and object format
        const username = typeof teammate === 'string' ? teammate : teammate.username || teammate.user;
        if (username && typeof username === 'string' && username.trim()) {
          const user = await User.findOne({ username: username.trim().toLowerCase() });
          if (user) {
            validTeammates.push(user._id);
          }
        }
      }
      // Update the teammates array to only include valid user IDs
      projectData.collaboration.teammates = validTeammates;
    } else if (projectData.collaboration) {
      // Ensure collaboration object has correct structure
      projectData.collaboration = {
        openToCollaboration: projectData.collaboration.openToCollaboration || false,
        lookingForRoles: projectData.collaboration.lookingForRoles || [],
        teammates: []
      };
    }

    const project = await Project.create({ 
      ...projectData, 
      author: userId,
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0
      }
    });

    // Award badge for first project
    const user = await User.findById(userId);
    if (user && user.stats?.projectsUploaded === 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.projectsUploaded': 1 }
      });
      // Note: Badge system will be implemented separately with proper ObjectId references
    } else if (user) {
      await User.findByIdAndUpdate(userId, {
        $inc: { 'stats.projectsUploaded': 1 }
      });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');

    // Check for badge awards
    try {
      console.log('Checking badges for project creation...');
      await BadgeService.checkAndAwardBadges(userId, 'project_created', (project._id as any).toString());
      console.log('Badge check completed successfully');
    } catch (badgeError) {
      console.error('Error checking badges for project creation:', badgeError);
      console.error('Badge error details:', (badgeError as Error).message);
      console.error('Badge error stack:', (badgeError as Error).stack);
    }

    return res.status(201).json({ success: true, data: populatedProject });
  } catch (error: any) {
    console.error('Create project error:', error);
    console.error('Error details:', error?.message);
    console.error('Stack trace:', error?.stack);
    console.error('Request body:', req.body);
    
    // Return more specific error message
    const errorMessage = error?.message || 'Failed to create project';
    return res.status(500).json({ 
      success: false, 
      error: errorMessage,
      details: error?.stack
    });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Not found' });
    if (String(project.author) !== String(userId)) return res.status(403).json({ success: false, error: 'Forbidden' });

    // Process contributors and teammates (loose shape from client; strip analyze-only keys)
    const updateData = { ...req.body } as Record<string, any>;
    stripEphemeralProjectFields(updateData as Record<string, unknown>);
    
    // Initialize contributors array
    updateData.contributors = [];
    
    // Handle contributors (from frontend collaborators field)
    if (updateData.collaborators && Array.isArray(updateData.collaborators) && updateData.collaborators.length > 0) {
      const contributors = updateData.collaborators
        .map((c: any) => {
          if (c && typeof c === 'object') {
            const name = (c.name || '').trim();
            const role = (c.role || '').trim();
            if (name) {
              return { name, role: role || 'Contributor', contributions: 'Project contributor' };
            }
          } else if (typeof c === 'string') {
            const name = c.trim();
            if (name) return { name, role: 'Contributor', contributions: 'Project contributor' };
          }
          return null;
        })
        .filter(Boolean);
      updateData.contributors = contributors as any;
    }
    
    // Remove collaborators field to avoid conflicts with schema
    delete updateData.collaborators;

    // Handle collaboration teammates
    if (updateData.collaboration?.teammates && Array.isArray(updateData.collaboration.teammates) && updateData.collaboration.teammates.length > 0) {
      // Validate that all teammates exist as users
      const validTeammates = [] as any[];
      for (const teammate of updateData.collaboration.teammates) {
        // Handle both string usernames and object format
        const username = typeof teammate === 'string' ? teammate : teammate.username || teammate.user;
        if (username && typeof username === 'string' && username.trim()) {
          const user = await User.findOne({ username: username.trim().toLowerCase() });
          if (user) {
            validTeammates.push(user._id);
          }
        }
      }
      // Update the teammates array to only include valid user IDs
      updateData.collaboration.teammates = validTeammates;
    } else if (updateData.collaboration) {
      // Ensure collaboration object has correct structure
      updateData.collaboration = {
        openToCollaboration: updateData.collaboration.openToCollaboration || false,
        lookingForRoles: updateData.collaboration.lookingForRoles || [],
        teammates: []
      };
    }

    Object.assign(project, updateData);
    await project.save();
    
    // Populate the project with author and contributors data
    const updatedProject = await Project.findById(project._id)
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .populate('contributors.user', 'username name avatarUrl avatarStyle bio skills');
    
    return res.json({ success: true, data: updatedProject });
  } catch (error) {
    console.error('Update project error:', error);
    return res.status(500).json({ success: false, error: 'Failed to update project' });
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const rawId = (req.params as any).id || (req.params as any).projectId;
    const paramId = typeof rawId === 'string' ? rawId.trim() : rawId;
    console.log('Delete project request - ID:', paramId);
    const userId = (req as any).user?.id;
    console.log('User ID:', userId);
    
    if (!paramId) {
      return res.status(400).json({ success: false, error: 'Project ID is required' });
    }
    
    let project = null as any;
    try {
      project = await Project.findById(paramId);
    } catch (castErr) {
      // If casting fails (e.g., non-ObjectId), try direct string match (in case _id stored as string)
      project = await Project.findOne({ _id: paramId } as any);
    }
    console.log('Project found:', !!project);
    
    if (!project) {
      console.log('Project not found for ID:', paramId);
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Check if user is the author
    if (String(project.author) !== String(userId)) {
      console.log('User is not the author of the project');
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
    
    console.log('Starting project deletion...');
    
    // Delete associated comments
    await Comment.deleteMany({ targetType: 'project', targetId: project._id });
    console.log('Comments deleted');
    
    // Delete associated collaboration requests
    await CollaborationRequest.deleteMany({ project: project._id });
    console.log('Collaboration requests deleted');
    
    // Delete the project
    await Project.findByIdAndDelete(paramId);
    console.log('Project deleted successfully');
    
    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete project' });
  }
}

export async function recalcHealth(req: Request, res: Response) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Not found' });
  // naive placeholder health score until full rules
  project.healthScore = Math.min(100, Math.max(0, (project.metrics?.likes || 0) + 50));
  await project.save();
  return res.json({ success: true, data: { healthScore: project.healthScore } });
}

export async function forkProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const fork = await Project.create({
      title: project.title + ' (fork)',
      tagline: project.tagline,
      description: project.description,
      author: userId,
      contributors: [],
      techStack: project.techStack,
      category: project.category,
      difficultyLevel: project.difficultyLevel,
      developmentStage: 'idea',
      coverImage: project.coverImage,
      screenshots: project.screenshots,
      keyFeatures: project.keyFeatures,
      links: project.links,
      collaboration: {
        openToCollaboration: true,
        lookingForRoles: [],
        teammates: []
      },
      badges: [],
      visibility: 'public',
      isDraft: false,
      tags: project.tags,
      status: 'planning',
      metrics: {
        views: 0,
        likes: 0,
        forks: 0,
        comments: 0,
        stars: 0,
        saves: 0,
        shares: 0
      }
    });
    
    // Increment fork count on original project
    await Project.findByIdAndUpdate(req.params.id, {
      $inc: { 'metrics.forks': 1 }
    });
    
    return res.json({ success: true, data: fork });
  } catch (error) {
    console.error('Fork project error:', error);
    res.status(500).json({ success: false, error: 'Failed to fork project' });
  }
}

export async function getTrendingProjects(req: Request, res: Response) {
  try {
    const { limit = '10' } = req.query;
    
    // Get projects with highest engagement (likes + views + comments)
    const projects = await Project.find({ visibility: 'public', isDraft: false })
      .populate('author', 'username name avatarUrl avatarStyle bio skills')
      .sort({ 
        'metrics.likes': -1, 
        'metrics.views': -1, 
        'metrics.comments': -1,
        createdAt: -1 
      })
      .limit(Number(limit));
    
    res.json({ success: true, data: projects });
  } catch (error) {
    console.error('Get trending projects error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch trending projects' });
  }
}

export async function likeProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Check if user already liked this project
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // For now, just increment like count (in a real app, you'd track individual likes)
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'metrics.likes': 1 }
    });
    
    // Update user's stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.likesReceived': 1 }
    });
    
    res.json({ success: true, message: 'Project liked successfully' });
  } catch (error) {
    console.error('Like project error:', error);
    res.status(500).json({ success: false, error: 'Failed to like project' });
  }
}

export async function bookmarkProject(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    // Toggle bookmark
    const isBookmarked = user.bookmarkedProjects.includes(projectId as any);
    
    if (isBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarkedProjects: projectId }
      });
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'metrics.saves': -1 }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarkedProjects: projectId }
      });
      await Project.findByIdAndUpdate(projectId, {
        $inc: { 'metrics.saves': 1 }
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        bookmarked: !isBookmarked,
        message: !isBookmarked ? 'Project bookmarked' : 'Bookmark removed'
      } 
    });
  } catch (error) {
    console.error('Bookmark project error:', error);
    res.status(500).json({ success: false, error: 'Failed to bookmark project' });
  }
}

export async function shareProject(req: Request, res: Response) {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    // Increment share count
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'metrics.shares': 1 }
    });
    
    res.json({ 
      success: true, 
      data: { 
        message: 'Project shared successfully',
        shareUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${projectId}`
      } 
    });
  } catch (error) {
    console.error('Share project error:', error);
    res.status(500).json({ success: false, error: 'Failed to share project' });
  }
}

export async function requestCollaboration(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const { projectId } = req.params;
    const { message, role } = req.body;
    
    const project = await Project.findById(projectId).populate('author', 'username name');
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    
    if (!project.collaboration?.openToCollaboration) {
      return res.status(400).json({ 
        success: false, 
        error: 'This project is not open to collaboration' 
      });
    }
    
    // Check if user is trying to collaborate on their own project
    if (project.author._id.toString() === userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot send collaboration request to yourself' 
      });
    }
    
    // Check if request already exists
    const existingRequest = await CollaborationRequest.findOne({
      projectId,
      requesterId: userId
    });
    
    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        error: 'Request already sent for this project' 
      });
    }
    
    // Create collaboration request
    const collaborationRequest = await CollaborationRequest.create({
      projectId,
      requesterId: userId,
      receiverId: project.author._id,
      compatibilityScore: 0, // Default score for project collaboration
      message: message || '',
      role: role || ''
    });
    
    // Create notification for project owner
    const requester = await User.findById(userId).select('username name');
    await Notification.create({
      user: project.author._id,
      type: 'collaboration_request',
      data: {
        requesterId: userId,
        requesterName: requester?.username,
        projectId: projectId,
        projectTitle: project.title,
        collaborationRequestId: collaborationRequest._id,
        message: message || '',
        role: role || ''
      }
    });
    
    // Add to users' tracking arrays
    await Promise.all([
      User.findByIdAndUpdate(userId, {
        $push: { collabRequestsSent: collaborationRequest._id }
      }),
      User.findByIdAndUpdate(project.author._id, {
        $push: { collabRequestsReceived: collaborationRequest._id }
      })
    ]);
    
    res.json({ 
      success: true, 
      data: { 
        message: 'Collaboration request sent successfully',
        projectTitle: project.title,
        authorUsername: (project.author as any).username,
        collaborationRequestId: collaborationRequest._id
      } 
    });
  } catch (error) {
    console.error('Request collaboration error:', error);
    res.status(500).json({ success: false, error: 'Failed to send collaboration request' });
  }
}

