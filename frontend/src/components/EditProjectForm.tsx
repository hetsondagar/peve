import { useState, useEffect } from 'react';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { apiFetch } from '@/lib/api';
import { X, Users, Sparkles, Loader2, Github, Lock } from 'lucide-react';
import UsernameAutocomplete from './UsernameAutocomplete';
import UsernameTag from './UsernameTag';

interface EditProjectFormProps {
  project: any;
  onSave: (updatedProject: any) => void;
  onCancel: () => void;
}

const PROJECT_CATEGORIES = [
  'Web Application', 'Mobile App', 'Desktop App', 'API', 'Library',
  'Machine Learning', 'Data Science', 'IoT', 'Game', 'DevOps',
  'Blockchain', 'AI/ML', 'Frontend', 'Backend', 'Full Stack'
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const DEVELOPMENT_STAGES = [
  { value: 'idea', label: 'Idea' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' }
];

type FieldLockKey =
  | 'title'
  | 'tagline'
  | 'category'
  | 'description'
  | 'keyFeatures'
  | 'techStack'
  | 'difficultyLevel'
  | 'developmentStage'
  | 'githubRepo';

const DEFAULT_FIELD_LOCKS: Record<FieldLockKey, boolean> = {
  title: false,
  tagline: false,
  category: false,
  description: false,
  keyFeatures: false,
  techStack: false,
  difficultyLevel: false,
  developmentStage: false,
  githubRepo: false,
};

const LOCK_LABELS: { key: FieldLockKey; label: string }[] = [
  { key: 'title', label: 'Title' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'keyFeatures', label: 'Features' },
  { key: 'techStack', label: 'Stack' },
  { key: 'difficultyLevel', label: 'Difficulty' },
  { key: 'developmentStage', label: 'Stage' },
  { key: 'githubRepo', label: 'GitHub URL' },
];

export default function EditProjectForm({ project, onSave, onCancel }: EditProjectFormProps) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    tagline: project?.tagline || '',
    description: project?.description || '',
    category: project?.category || '',
    difficultyLevel: project?.difficultyLevel || 'beginner',
    developmentStage: project?.developmentStage || 'idea',
    techStack: project?.techStack || [],
    keyFeatures: project?.keyFeatures || [],
    tags: project?.tags || [],
    // Initialize collaborators from contributors list (names + roles)
    collaborators: (project?.contributors || [])
      .map((c: any) => ({ name: c?.name || c?.user?.name || c?.user?.username, role: c?.role || '' }))
      .filter((c: any) => typeof c?.name === 'string' && c.name) || [],
    links: {
      liveDemo: project?.links?.liveDemo || '',
      githubRepo: project?.links?.githubRepo || '',
      documentation: project?.links?.documentation || '',
      videoDemo: project?.links?.videoDemo || ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [githubAutofillUrl, setGithubAutofillUrl] = useState('');
  const [githubAutofillLoading, setGithubAutofillLoading] = useState(false);
  const [fieldLocks, setFieldLocks] = useState<Record<FieldLockKey, boolean>>({ ...DEFAULT_FIELD_LOCKS });
  const [autofillPreview, setAutofillPreview] = useState<{
    intelligence?: unknown;
    commitTimeline?: { sha: string; message: string; date: string; author?: string }[];
  } | null>(null);

  useEffect(() => {
    setGithubAutofillUrl(project?.links?.githubRepo || '');
    setAutofillPreview(null);
    setFieldLocks({ ...DEFAULT_FIELD_LOCKS });
  }, [project?._id, project?.links?.githubRepo]);

  const applyGithubAutofill = async () => {
    const url = githubAutofillUrl.trim();
    if (!url) {
      setError('Enter a GitHub repository URL first.');
      return;
    }
    setGithubAutofillLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/projects/analyze-github-repo', {
        method: 'POST',
        body: JSON.stringify({ repoUrl: url }),
      });
      const d = res.data as {
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
        intelligence?: unknown;
        commitTimeline?: { sha: string; message: string; date: string; author?: string }[];
      };
      setAutofillPreview({
        intelligence: d.intelligence,
        commitTimeline: d.commitTimeline,
      });
      const category = PROJECT_CATEGORIES.includes(d.category)
        ? d.category
        : 'Web Application';
      const topicTags = (d.topics || []).slice(0, 10).map((t) => t.replace(/-/g, ' '));
      const L = fieldLocks;
      setFormData((prev) => ({
        ...prev,
        title: L.title ? prev.title : d.title || prev.title,
        tagline: L.tagline ? prev.tagline : d.tagline || prev.tagline,
        category: L.category ? prev.category : category,
        description: L.description ? prev.description : d.description || prev.description,
        keyFeatures: L.keyFeatures
          ? prev.keyFeatures
          : d.keyFeatures?.length
            ? d.keyFeatures
            : prev.keyFeatures,
        techStack: L.techStack
          ? prev.techStack
          : d.techStack?.length
            ? [...new Set(d.techStack)]
            : prev.techStack,
        difficultyLevel: L.difficultyLevel
          ? prev.difficultyLevel
          : (['beginner', 'intermediate', 'advanced'].includes(d.difficultyLevel)
              ? d.difficultyLevel
              : prev.difficultyLevel) as typeof prev.difficultyLevel,
        developmentStage: L.developmentStage
          ? prev.developmentStage
          : (['idea', 'prototype', 'ongoing', 'completed'].includes(d.developmentStage)
              ? d.developmentStage
              : prev.developmentStage) as typeof prev.developmentStage,
        tags: [...new Set([...prev.tags, ...topicTags])].slice(0, 20),
        links: {
          ...prev.links,
          githubRepo: L.githubRepo ? prev.links.githubRepo : d.githubRepo || prev.links.githubRepo,
        },
      }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Autofill failed');
    } finally {
      setGithubAutofillLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addArrayItem = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[]), value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      return {
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      };
    });
  };

  


  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.tagline.trim() || !formData.description.trim() || !formData.category.trim()) {
        throw new Error('Title, tagline, description, and category are required');
      }


      const response = await apiFetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        onSave(response.data);
      } else {
        throw new Error(response.error || 'Failed to update project');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[min(70vh,32rem)] overflow-y-auto">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className="w-5 h-5 shrink-0" />
          <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] uppercase tracking-[0.24em] text-primary">
            Start here
          </Badge>
          <span className="font-semibold text-foreground">Autofill from GitHub repo</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Re-analyze a public repo to refresh fields. Locks prevent overwriting sensitive edits.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="https://github.com/owner/repository"
            value={githubAutofillUrl}
            onChange={(e) => setGithubAutofillUrl(e.target.value)}
            className="bg-card-secondary border-primary/20 rounded-xl h-11 flex-1"
          />
          <GlowButton
            type="button"
            variant="outline"
            disabled={githubAutofillLoading}
            onClick={() => void applyGithubAutofill()}
            className="shrink-0 gap-2 border-primary/40"
          >
            {githubAutofillLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            Analyze &amp; autofill
          </GlowButton>
        </div>
        <div className="rounded-lg border border-border/60 bg-card-secondary/40 p-3 space-y-2">
          <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Lock fields
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {LOCK_LABELS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer"
              >
                <Checkbox
                  checked={fieldLocks[key]}
                  onCheckedChange={(v) =>
                    setFieldLocks((prev) => ({ ...prev, [key]: Boolean(v) }))
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        {autofillPreview?.intelligence && (
          <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3 text-[11px]">
            <p className="font-semibold text-secondary flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              ML preview
            </p>
            <p className="text-muted-foreground">
              Score:{' '}
              <span className="text-foreground font-mono">
                {(autofillPreview.intelligence as { peve_score_ml?: number }).peve_score_ml ?? '—'}
              </span>
              /100
            </p>
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Project Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter project title"
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Tagline *
          </label>
          <Input
            value={formData.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Brief description of your project"
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your project in detail"
            rows={4}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 bg-card-secondary border border-primary/20 rounded-lg focus:border-primary focus:outline-none"
          >
            <option value="">Select category</option>
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Difficulty</label>
            <select
              value={formData.difficultyLevel}
              onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
              className="w-full p-3 bg-card-secondary border border-primary/20 rounded-lg focus:border-primary focus:outline-none"
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Development stage</label>
            <select
              value={formData.developmentStage}
              onChange={(e) => handleInputChange('developmentStage', e.target.value)}
              className="w-full p-3 bg-card-secondary border border-primary/20 rounded-lg focus:border-primary focus:outline-none"
            >
              {DEVELOPMENT_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Tech Stack
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add technology"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addArrayItem('techStack', newTech);
                setNewTech('');
              }
            }}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
          <GlowButton
            size="sm"
            onClick={() => {
              addArrayItem('techStack', newTech);
              setNewTech('');
            }}
          >
            Add
          </GlowButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.techStack.map((tech, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {tech}
              <button
                onClick={() => removeArrayItem('techStack', index)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Key Features
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add feature"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addArrayItem('keyFeatures', newFeature);
                setNewFeature('');
              }
            }}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
          <GlowButton
            size="sm"
            onClick={() => {
              addArrayItem('keyFeatures', newFeature);
              setNewFeature('');
            }}
          >
            Add
          </GlowButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.keyFeatures.map((feature, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {feature}
              <button
                onClick={() => removeArrayItem('keyFeatures', index)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      

      {/* Links */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            GitHub Repository
          </label>
          <Input
            value={formData.links.githubRepo}
            onChange={(e) => handleInputChange('links.githubRepo', e.target.value)}
            placeholder="https://github.com/username/repo"
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Live Demo
          </label>
          <Input
            value={formData.links.liveDemo}
            onChange={(e) => handleInputChange('links.liveDemo', e.target.value)}
            placeholder="https://your-demo.com"
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <GlowButton
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </GlowButton>
        <GlowButton
          onClick={handleSubmit}
          className="flex-1"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </GlowButton>
      </div>
    </div>
  );
}
