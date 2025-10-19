import { useState } from 'react';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { X } from 'lucide-react';

interface EditIdeaFormProps {
  idea: any;
  onSave: (updatedIdea: any) => void;
  onCancel: () => void;
}

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

export default function EditIdeaForm({ idea, onSave, onCancel }: EditIdeaFormProps) {
  const [formData, setFormData] = useState({
    title: idea?.title || '',
    description: idea?.description || '',
    tags: idea?.tags || [],
    difficulty: idea?.difficulty || 'beginner',
    skillsNeeded: idea?.skillsNeeded || [],
    estimatedTime: idea?.estimatedTime || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required');
      }

      const response = await apiFetch(`/api/ideas/${idea._id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (response.success) {
        onSave(response.data);
      } else {
        throw new Error(response.error || 'Failed to update idea');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update idea');
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
            Idea Title *
          </label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter idea title"
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
            placeholder="Describe your idea in detail"
            rows={4}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Difficulty Level
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full p-3 bg-card-secondary border border-primary/20 rounded-lg focus:border-primary focus:outline-none"
          >
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Estimated Time
          </label>
          <Input
            value={formData.estimatedTime}
            onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
            placeholder="e.g., 2 weeks, 1 month"
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addArrayItem('tags', newTag);
                setNewTag('');
              }
            }}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
          <GlowButton
            size="sm"
            onClick={() => {
              addArrayItem('tags', newTag);
              setNewTag('');
            }}
          >
            Add
          </GlowButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              #{tag}
              <button
                onClick={() => removeArrayItem('tags', index)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills Needed */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Skills Needed
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addArrayItem('skillsNeeded', newSkill);
                setNewSkill('');
              }
            }}
            className="bg-card-secondary border-primary/20 focus:border-primary"
          />
          <GlowButton
            size="sm"
            onClick={() => {
              addArrayItem('skillsNeeded', newSkill);
              setNewSkill('');
            }}
          >
            Add
          </GlowButton>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skillsNeeded.map((skill, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {skill}
              <button
                onClick={() => removeArrayItem('skillsNeeded', index)}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
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
