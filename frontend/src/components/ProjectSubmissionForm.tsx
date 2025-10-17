import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Upload, ChevronLeft, ChevronRight, 
  Github, Globe, FileText, Play, Users, Tag,
  Check, AlertCircle
} from 'lucide-react';
import { GlowButton } from '@/components/ui/glow-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import UsernameTag from '@/components/UsernameTag';

interface ProjectSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
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

const COLLABORATION_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'UI/UX Designer', 'Mobile Developer', 'DevOps Engineer',
  'Data Scientist', 'ML Engineer', 'Product Manager', 'QA Tester'
];

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public', description: 'Visible to everyone' },
  { value: 'private', label: 'Private', description: 'Only you can see' },
  { value: 'friends-only', label: 'Friends Only', description: 'Visible to your connections' }
];

export default function ProjectSubmissionForm({ isOpen, onClose }: ProjectSubmissionFormProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    title: '',
    tagline: '',
    category: '',
    thumbnail: null as File | null,
    thumbnailUrl: '',
    
    // Step 2 - Core Details
    description: '',
    keyFeatures: [] as string[],
    techStack: [] as string[],
    difficultyLevel: 'beginner',
    developmentStage: 'idea',
    
    // Step 3 - Links & Resources
    links: {
      liveDemo: '',
      githubRepo: '',
      documentation: '',
      videoDemo: ''
    },
    
    // Step 4 - Collaboration
    collaboration: {
      openToCollaboration: false,
      lookingForRoles: [] as string[],
      teammates: [] as string[]
    },
    
    // Step 5 - Finalize
    tags: [] as string[],
    visibility: 'public',
    isDraft: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTeammate, setNewTeammate] = useState('');
  const [usernameValidation, setUsernameValidation] = useState<{
    isValidating: boolean;
    invalidUsernames: string[];
    validUsernames: string[];
  }>({
    isValidating: false,
    invalidUsernames: [],
    validUsernames: []
  });

  const totalSteps = 5;

  const validateUsernames = async (usernames: string[]) => {
    if (usernames.length === 0) return;
    
    setUsernameValidation(prev => ({ ...prev, isValidating: true }));
    
    try {
      const response = await apiFetch('/api/users/validate', {
        method: 'POST',
        body: JSON.stringify({ usernames })
      });
      
      if (response.success) {
        setUsernameValidation({
          isValidating: false,
          invalidUsernames: response.data.invalid,
          validUsernames: response.data.valid
        });
      }
    } catch (error) {
      console.error('Failed to validate usernames:', error);
      setUsernameValidation(prev => ({ ...prev, isValidating: false }));
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiFetch('/api/uploads', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        }
      });
      
      return response.data.url;
    } catch (error) {
      console.error('File upload failed:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, thumbnail: file }));
      
      try {
        const url = await handleFileUpload(file);
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      } catch (error) {
        setError('Failed to upload image');
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const addArrayItem = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[] | undefined;
    if (value.trim() && currentArray && !currentArray.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[]), value.trim()]
      }));
    }
  };

  const addTeammate = async (username: string) => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    
    const currentTeammates = formData.collaboration.teammates;
    if (currentTeammates.includes(trimmedUsername)) return;
    
    // Validate the username
    await validateUsernames([trimmedUsername]);
    
    // Add to form data
    setFormData(prev => ({
      ...prev,
      collaboration: {
        ...prev.collaboration,
        teammates: [...prev.collaboration.teammates, trimmedUsername]
      }
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[] | undefined;
      if (!currentArray) return prev;
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
      if (!formData.title || !formData.tagline || !formData.category || !formData.links.githubRepo) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare project data with cover image
      const projectData = {
        ...formData,
        coverImage: formData.thumbnailUrl ? {
          url: formData.thumbnailUrl,
          publicId: formData.thumbnailUrl.split('/').pop()?.split('.')[0] || ''
        } : undefined
      };
      
      // Remove the file object from the data
      delete projectData.thumbnail;
      delete projectData.thumbnailUrl;

      const response = await apiFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });

      // Show success message
      alert('Project created successfully!');
      
      // Close modal and navigate to project detail
      onClose();
      navigate(`/projects/${response.data._id}`);
      
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.title.trim() && formData.tagline.trim() && formData.category;
      case 2:
        return formData.description.trim();
      case 3:
        return formData.links.githubRepo.trim();
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Create New Project</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i + 1 <= currentStep
                      ? 'bg-primary text-white'
                      : 'bg-card-secondary text-muted-foreground'
                  }`}
                >
                  {i + 1 < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-primary' : 'bg-card-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-foreground">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Project Title *
                      {formData.title.trim() && <span className="text-green-500 ml-2">✓</span>}
                    </label>
                    <Input
                      placeholder="Enter a catchy project title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 ${
                        formData.title.trim() ? 'border-green-500/50' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Short Tagline *
                      {formData.tagline.trim() && <span className="text-green-500 ml-2">✓</span>}
                    </label>
                    <Input
                      placeholder="One-line summary of your project"
                      value={formData.tagline}
                      onChange={(e) => handleInputChange('tagline', e.target.value)}
                      className={`bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 ${
                        formData.tagline.trim() ? 'border-green-500/50' : ''
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Category *
                      {formData.category && <span className="text-green-500 ml-2">✓</span>}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full p-3 rounded-xl bg-card-secondary border border-primary/20 focus:border-primary focus:glow-subtle ${
                        formData.category ? 'border-green-500/50' : ''
                      }`}
                    >
                      <option value="">Select a category</option>
                      {PROJECT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Thumbnail Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="thumbnail"
                        className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer block"
                      >
                        {formData.thumbnail ? (
                          <div className="space-y-2">
                            <img
                              src={URL.createObjectURL(formData.thumbnail)}
                              alt="Thumbnail preview"
                              className="w-20 h-20 object-cover rounded-lg mx-auto"
                            />
                            <p className="text-sm text-foreground">{formData.thumbnail.name}</p>
                            <p className="text-xs text-muted-foreground">Click to change</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                      {formData.thumbnailUrl && (
                        <p className="text-xs text-green-500">✓ Image uploaded successfully</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-foreground">Core Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Description / Overview *
                    </label>
                    <Textarea
                      placeholder="Explain what your project does, its purpose, and how it helps"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Key Features
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a key feature"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('keyFeatures', newFeature);
                              setNewFeature('');
                            }
                          }}
                          className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
                        />
                        <GlowButton
                          size="sm"
                          onClick={() => {
                            addArrayItem('keyFeatures', newFeature);
                            setNewFeature('');
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </GlowButton>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.keyFeatures.map((feature, index) => (
                          <Badge key={index} variant="teal" className="flex items-center gap-1">
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
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Tech Stack
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a technology"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('techStack', newTech);
                              setNewTech('');
                            }
                          }}
                          className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
                        />
                        <GlowButton
                          size="sm"
                          onClick={() => {
                            addArrayItem('techStack', newTech);
                            setNewTech('');
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </GlowButton>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.techStack.map((tech, index) => (
                          <Badge key={index} variant="teal" className="flex items-center gap-1">
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
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficultyLevel}
                        onChange={(e) => handleInputChange('difficultyLevel', e.target.value)}
                        className="w-full p-3 rounded-xl bg-card-secondary border border-primary/20 focus:border-primary focus:glow-subtle"
                      >
                        {DIFFICULTY_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Development Stage
                      </label>
                      <select
                        value={formData.developmentStage}
                        onChange={(e) => handleInputChange('developmentStage', e.target.value)}
                        className="w-full p-3 rounded-xl bg-card-secondary border border-primary/20 focus:border-primary focus:glow-subtle"
                      >
                        {DEVELOPMENT_STAGES.map((stage) => (
                          <option key={stage.value} value={stage.value}>{stage.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-foreground">Links & Resources</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      GitHub Repository URL *
                    </label>
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="https://github.com/username/repository"
                        value={formData.links.githubRepo}
                        onChange={(e) => handleNestedInputChange('links', 'githubRepo', e.target.value)}
                        className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Live Demo URL
                    </label>
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="https://your-project.com"
                        value={formData.links.liveDemo}
                        onChange={(e) => handleNestedInputChange('links', 'liveDemo', e.target.value)}
                        className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Documentation URL
                    </label>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="https://docs.your-project.com"
                        value={formData.links.documentation}
                        onChange={(e) => handleNestedInputChange('links', 'documentation', e.target.value)}
                        className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Video Demo URL
                    </label>
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={formData.links.videoDemo}
                        onChange={(e) => handleNestedInputChange('links', 'videoDemo', e.target.value)}
                        className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-foreground">Collaboration</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="openToCollaboration"
                      checked={formData.collaboration.openToCollaboration}
                      onChange={(e) => handleNestedInputChange('collaboration', 'openToCollaboration', e.target.checked)}
                      className="w-4 h-4 rounded border-primary/20 focus:ring-primary"
                    />
                    <label htmlFor="openToCollaboration" className="text-sm font-semibold text-foreground">
                      Open to Collaboration
                    </label>
                  </div>

                  {formData.collaboration.openToCollaboration && (
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Looking for Roles
                      </label>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {COLLABORATION_ROLES.map((role) => (
                            <label key={role} className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                              <input
                                type="checkbox"
                                checked={formData.collaboration.lookingForRoles.includes(role)}
                                onChange={(e) => {
                                  const roles = formData.collaboration.lookingForRoles;
                                  if (e.target.checked) {
                                    handleNestedInputChange('collaboration', 'lookingForRoles', [...roles, role]);
                                  } else {
                                    handleNestedInputChange('collaboration', 'lookingForRoles', roles.filter(r => r !== role));
                                  }
                                }}
                                className="w-4 h-4 rounded border-primary/20 focus:ring-primary"
                              />
                              <span className="text-sm text-foreground">{role}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Add Teammates (Peve usernames)
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter username"
                          value={newTeammate}
                          onChange={(e) => setNewTeammate(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addTeammate(newTeammate);
                              setNewTeammate('');
                            }
                          }}
                          className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
                        />
                        <GlowButton
                          size="sm"
                          onClick={() => {
                            addTeammate(newTeammate);
                            setNewTeammate('');
                          }}
                          disabled={usernameValidation.isValidating}
                        >
                          {usernameValidation.isValidating ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </GlowButton>
                      </div>
                      
                      {/* Validation feedback */}
                      {usernameValidation.invalidUsernames.length > 0 && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Invalid usernames: {usernameValidation.invalidUsernames.join(', ')}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        {formData.collaboration.teammates.map((teammate, index) => (
                          <UsernameTag
                            key={index}
                            username={teammate}
                            onRemove={() => removeArrayItem('collaboration.teammates', index)}
                            variant={usernameValidation.invalidUsernames.includes(teammate) ? 'destructive' : 'outline'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-foreground">Finalize</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Tags / Keywords
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addArrayItem('tags', newTag);
                              setNewTag('');
                            }
                          }}
                          className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-10"
                        />
                        <GlowButton
                          size="sm"
                          onClick={() => {
                            addArrayItem('tags', newTag);
                            setNewTag('');
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </GlowButton>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="teal" className="flex items-center gap-1">
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
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      {VISIBILITY_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={formData.visibility === option.value}
                            onChange={(e) => handleInputChange('visibility', e.target.value)}
                            className="w-4 h-4 border-primary/20 focus:ring-primary"
                          />
                          <div>
                            <p className="font-semibold text-foreground">{option.label}</p>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isDraft"
                      checked={formData.isDraft}
                      onChange={(e) => handleInputChange('isDraft', e.target.checked)}
                      className="w-4 h-4 rounded border-primary/20 focus:ring-primary"
                    />
                    <label htmlFor="isDraft" className="text-sm font-semibold text-foreground">
                      Save as Draft
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20">
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <GlowButton
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </GlowButton>

          <div className="flex items-center gap-2">
            {/* Debug info - remove in production */}
            <div className="text-xs text-muted-foreground mr-4">
              Step {currentStep} valid: {isStepValid(currentStep) ? 'Yes' : 'No'}
            </div>
            
            {currentStep < totalSteps ? (
              <GlowButton
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </GlowButton>
            ) : (
              <GlowButton
                onClick={handleSubmit}
                disabled={loading || !isStepValid(currentStep)}
                className="flex items-center gap-2"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </GlowButton>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
