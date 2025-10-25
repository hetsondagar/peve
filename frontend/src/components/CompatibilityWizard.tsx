import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { X, ChevronLeft, ChevronRight, Check, Clock, Users, Target, Settings } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CompatibilityWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface CompatibilityOptions {
  preferredRoles: string[];
  preferredWorkHours: Array<{ value: string; label: string }>;
  interests: string[];
  goals: string[];
  workStyle: {
    teamPreference: Array<{ value: string; label: string; description: string }>;
    pace: Array<{ value: string; label: string; description: string }>;
    communication: Array<{ value: string; label: string; description: string }>;
    decisionStyle: Array<{ value: string; label: string; description: string }>;
  };
}

interface FormData {
  // Step 1 - Skills & Roles
  skills: string[];
  preferredRoles: string[];
  
  // Step 2 - Availability & Timezone
  availabilityHours: number;
  timeZone: string;
  preferredWorkHours: string;
  
  // Step 3 - Interests & Goals
  interests: string[];
  goals: string[];
  
  // Step 4 - Work Style
  workStyle: {
    teamPreference: string;
    pace: string;
    communication: string;
    decisionStyle: string;
  };
}

const STEPS = [
  { id: 1, title: 'Skills & Roles', icon: Settings, description: 'Tell us about your technical skills and preferred roles' },
  { id: 2, title: 'Availability', icon: Clock, description: 'When and how much can you collaborate?' },
  { id: 3, title: 'Interests & Goals', icon: Target, description: 'What drives you and what do you want to achieve?' },
  { id: 4, title: 'Work Style', icon: Users, description: 'How do you prefer to work with others?' }
];

export default function CompatibilityWizard({ isOpen, onClose, onComplete }: CompatibilityWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [options, setOptions] = useState<CompatibilityOptions | null>(null);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const skillInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    skills: [],
    preferredRoles: [],
    availabilityHours: 10,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferredWorkHours: 'flexible',
    interests: [],
    goals: [],
    workStyle: {
      teamPreference: 'collaborative',
      pace: 'structured',
      communication: 'asynchronous',
      decisionStyle: 'consensus'
    }
  });

  // Load options on mount
  useEffect(() => {
    if (isOpen) {
      loadOptions();
    }
  }, [isOpen]);

  // Auto-detect timezone
  useEffect(() => {
    if (isOpen && !formData.timeZone) {
      setFormData(prev => ({
        ...prev,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
    }
  }, [isOpen, formData.timeZone]);

  const loadOptions = async () => {
    try {
      const response = await apiFetch('/api/compatibility/options');
      setOptions(response.data);
    } catch (error) {
      console.error('Failed to load options:', error);
      setError('Failed to load form options');
    }
  };

  const loadSkillSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSkillSuggestions([]);
      return;
    }
    
    try {
      const response = await apiFetch(`/api/compatibility/skills/suggestions?query=${encodeURIComponent(query)}`);
      setSkillSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to load skill suggestions:', error);
    }
  };

  const handleSkillQueryChange = (value: string) => {
    setSkillQuery(value);
    loadSkillSuggestions(value);
    setShowSkillSuggestions(true);
  };

  const addSkill = (skill: string) => {
    const normalizedSkill = skill.toLowerCase().trim();
    if (normalizedSkill && !formData.skills.includes(normalizedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, normalizedSkill]
      }));
    }
    setSkillQuery('');
    setShowSkillSuggestions(false);
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item];
      
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkStyleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      workStyle: {
        ...prev.workStyle,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.skills.length > 0 && formData.preferredRoles.length > 0;
      case 2:
        return formData.timeZone.length > 0;
      case 3:
        return true; // Optional step
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  const saveStep = async () => {
    setSaving(true);
    try {
      await apiFetch('/api/compatibility/profile', {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      toast({
        title: "Progress saved",
        description: "Your compatibility profile has been updated.",
      });
    } catch (error) {
      console.error('Failed to save step:', error);
      toast({
        title: "Save failed",
        description: "Couldn't save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    
    // Auto-save current step
    await saveStep();

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (!validateStep(1) || !validateStep(2)) {
        throw new Error('Please complete all required fields');
      }

      await apiFetch('/api/compatibility/setup', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      toast({
        title: "Setup complete!",
        description: "Your compatibility profile has been created successfully.",
      });

      onComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Technical Skills</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add your main programming languages, frameworks, and tools
        </p>
        
        <div className="relative">
          <Input
            ref={skillInputRef}
            placeholder="Type to search skills..."
            value={skillQuery}
            onChange={(e) => handleSkillQueryChange(e.target.value)}
            onFocus={() => setShowSkillSuggestions(true)}
            className="mb-2"
          />
          
          <AnimatePresence>
            {showSkillSuggestions && skillSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                {skillSuggestions.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                  >
                    {skill}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill) => (
            <Badge key={skill} variant="teal" className="cursor-pointer" onClick={() => removeSkill(skill)}>
              {skill} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Preferred Roles</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What roles do you enjoy most? (Select all that apply)
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {options?.preferredRoles.map((role) => (
            <button
              key={role}
              onClick={() => toggleArrayItem('preferredRoles', role)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                formData.preferredRoles.includes(role)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{role}</span>
                {formData.preferredRoles.includes(role) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Availability</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How many hours per week can you dedicate to collaboration?
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Hours per week: {formData.availabilityHours}
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={formData.availabilityHours}
              onChange={(e) => handleInputChange('availabilityHours', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 hours</span>
              <span>40+ hours</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Time Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Your current timezone: {formData.timeZone}
        </p>
        <Input
          value={formData.timeZone}
          onChange={(e) => handleInputChange('timeZone', e.target.value)}
          placeholder="e.g., America/New_York"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Preferred Work Hours</h3>
        <p className="text-sm text-muted-foreground mb-4">
          When do you prefer to work?
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {options?.preferredWorkHours.map((option) => (
            <button
              key={option.value}
              onClick={() => handleInputChange('preferredWorkHours', option.value)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                formData.preferredWorkHours === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{option.label}</span>
                {formData.preferredWorkHours === option.value && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Interests</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What areas interest you most? (Select all that apply)
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {options?.interests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleArrayItem('interests', interest)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                formData.interests.includes(interest)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{interest}</span>
                {formData.interests.includes(interest) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Goals</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What are your main goals? (Select all that apply)
        </p>
        
        <div className="grid grid-cols-2 gap-2">
          {options?.goals.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleArrayItem('goals', goal)}
              className={`p-3 text-left rounded-lg border transition-colors ${
                formData.goals.includes(goal)
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal}</span>
                {formData.goals.includes(goal) && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Team Preference</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How do you prefer to work with others?
        </p>
        
        <div className="space-y-2">
          {options?.workStyle.teamPreference.map((option) => (
            <button
              key={option.value}
              onClick={() => handleWorkStyleChange('teamPreference', option.value)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                formData.workStyle.teamPreference === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {formData.workStyle.teamPreference === option.value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Work Pace</h3>
        <p className="text-sm text-muted-foreground mb-4">
          What pace do you prefer for development?
        </p>
        
        <div className="space-y-2">
          {options?.workStyle.pace.map((option) => (
            <button
              key={option.value}
              onClick={() => handleWorkStyleChange('pace', option.value)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                formData.workStyle.pace === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {formData.workStyle.pace === option.value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Communication Style</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How do you prefer to communicate with team members?
        </p>
        
        <div className="space-y-2">
          {options?.workStyle.communication.map((option) => (
            <button
              key={option.value}
              onClick={() => handleWorkStyleChange('communication', option.value)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                formData.workStyle.communication === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {formData.workStyle.communication === option.value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Decision Making</h3>
        <p className="text-sm text-muted-foreground mb-4">
          How do you prefer to make decisions in a team?
        </p>
        
        <div className="space-y-2">
          {options?.workStyle.decisionStyle.map((option) => (
            <button
              key={option.value}
              onClick={() => handleWorkStyleChange('decisionStyle', option.value)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                formData.workStyle.decisionStyle === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {formData.workStyle.decisionStyle === option.value && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <currentStepData.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Compatibility Setup</h2>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep} of {STEPS.length}: {currentStepData.title}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{currentStepData.description}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

        </div>

        <div className="flex justify-between items-center p-6 border-t border-border flex-shrink-0">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>

          <div className="flex gap-2">
            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            )}
            
            <Button 
              onClick={handleNext} 
              disabled={loading || !validateStep(currentStep)}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {currentStep === 4 ? 'Completing...' : 'Saving...'}
                </>
              ) : (
                <>
                  {currentStep === 4 ? 'Complete Setup' : 'Save & Continue'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
