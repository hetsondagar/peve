import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, MessageSquare, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedUser: any) => void;
}

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const { toast } = useToast();
  const [githubUsername, setGithubUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGithubUsername('');
      setDiscordUsername('');
      setLinkedinUrl('');
      setError('');
    }
  }, [isOpen]);

  const validateDiscordUsername = (discord: string) => {
    if (!discord) return ''; // Discord username is optional
    return /^[a-zA-Z0-9_.]+$/.test(discord) ? '' : 'Invalid Discord username format';
  };

  const validateLinkedInUrl = (url: string) => {
    if (!url) return 'LinkedIn URL is required';
    return url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/) ? '' : 'Invalid LinkedIn URL format';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!githubUsername.trim()) {
      setError('GitHub username is required');
      return;
    }

    const linkedinError = validateLinkedInUrl(linkedinUrl);
    if (linkedinError) {
      setError(linkedinError);
      return;
    }

    const discordError = validateDiscordUsername(discordUsername);
    if (discordError) {
      setError(discordError);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiFetch('/api/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify({ githubUsername, discordUsername, linkedinUrl }),
      });

      if (response.success) {
        toast({
          title: 'Onboarding Complete!',
          description: 'Your profile is now ready for collaboration.',
          variant: 'success',
        });
        onComplete(response.data.user);
      } else {
        setError(response.error || 'Failed to complete onboarding');
        toast({
          title: 'Onboarding Failed',
          description: response.error || 'An error occurred during onboarding.',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'An unexpected error occurred');
      toast({
        title: 'Onboarding Failed',
        description: err.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-md p-6 space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold gradient-text mb-2">Complete Your Profile</h2>
              <p className="text-muted-foreground">
                Please provide a few details to enable collaboration features.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* GitHub Username */}
              <div className="space-y-2">
                <label htmlFor="githubUsername" className="text-sm font-medium text-muted-foreground">GitHub Username *</label>
                <div className="relative">
                  <Input
                    id="githubUsername"
                    type="text"
                    placeholder="e.g., octocat"
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pl-10"
                    required
                  />
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Discord Username */}
              <div className="space-y-2">
                <label htmlFor="discordUsername" className="text-sm font-medium text-muted-foreground">Discord Username (Optional)</label>
                <div className="relative">
                  <Input
                    id="discordUsername"
                    type="text"
                    placeholder="e.g., username#1234"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pl-10"
                  />
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {discordUsername && validateDiscordUsername(discordUsername) && (
                  <p className="text-red-500 text-sm mt-1">{validateDiscordUsername(discordUsername)}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">Optional - for gaming and community collaboration</p>
              </div>

              {/* LinkedIn URL */}
              <div className="space-y-2">
                <label htmlFor="linkedinUrl" className="text-sm font-medium text-muted-foreground">LinkedIn Profile URL *</label>
                <div className="relative">
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="e.g., https://linkedin.com/in/yourname"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pl-10"
                    required
                  />
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                {linkedinUrl && validateLinkedInUrl(linkedinUrl) && (
                  <p className="text-red-500 text-sm mt-1">{validateLinkedInUrl(linkedinUrl)}</p>
                )}
              </div>

              <GlowButton type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
              </GlowButton>
            </form>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                You can edit these details later from your profile settings
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
