import { useState, useEffect } from 'react';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { X, Users } from 'lucide-react';
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
    collaborators: project?.collaborators?.map((c: any) => c.username) || [],
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
  const [invalidUsernames, setInvalidUsernames] = useState<string[]>([]);
  const [validatingUsernames, setValidatingUsernames] = useState(false);

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

  const removeCollaborator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index)
    }));
  };

  const validateUsernames = async (usernames: string[]) => {
    if (usernames.length === 0) {
      setInvalidUsernames([]);
      return true;
    }

    setValidatingUsernames(true);
    try {
      const invalid: string[] = [];
      
      for (const username of usernames) {
        try {
          const response = await apiFetch(`/api/users/${username}`);
          if (!response.success || !response.data) {
            invalid.push(username);
          }
        } catch {
          invalid.push(username);
        }
      }
      
      setInvalidUsernames(invalid);
      setValidatingUsernames(false);
      return invalid.length === 0;
    } catch (error) {
      console.error('Error validating usernames:', error);
      setValidatingUsernames(false);
      return false;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.tagline.trim() || !formData.description.trim() || !formData.category.trim()) {
        throw new Error('Title, tagline, description, and category are required');
      }

      // Validate usernames
      const usernamesValid = await validateUsernames(formData.collaborators);
      if (!usernamesValid) {
        throw new Error('Please remove invalid usernames (shown in red) before saving');
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
    <div className="space-y-6 max-h-96 overflow-y-auto">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

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

      {/* Contributors */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          Contributors
        </h3>
        <div className="space-y-3">
          <UsernameAutocomplete
            onSelect={(username) => {
              if (!formData.collaborators.includes(username)) {
                setFormData(prev => ({
                  ...prev,
                  collaborators: [...prev.collaborators, username]
                }));
                setInvalidUsernames(prev => prev.filter(u => u !== username));
              }
            }}
            onRemove={(username) => {
              setFormData(prev => ({
                ...prev,
                collaborators: prev.collaborators.filter(u => u !== username)
              }));
              setInvalidUsernames(prev => prev.filter(u => u !== username));
            }}
            selectedUsernames={formData.collaborators}
            invalidUsernames={invalidUsernames}
            placeholder="Search for Peve usernames..."
            disabled={loading || validatingUsernames}
          />
          
          <p className="text-xs text-muted-foreground">
            💡 Add Peve usernames as contributors to this project. Projects will show on their profile too.
          </p>
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
