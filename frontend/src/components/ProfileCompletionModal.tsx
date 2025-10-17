import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { GlowButton } from '@/components/ui/glow-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  generateAvatar, 
  generateAvatarDataUrl, 
  getRandomSeed, 
  AVATAR_STYLES,
  type AvatarStyle 
} from '@/lib/avatar';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: (updatedUser: any) => void;
  currentUser: any;
}

export default function ProfileCompletionModal({ 
  isOpen, 
  onComplete, 
  currentUser 
}: ProfileCompletionModalProps) {
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>('botttsNeutral');
  const [currentSeed, setCurrentSeed] = useState(currentUser?.username || 'user');
  const [loading, setLoading] = useState(false);

  const handleStyleSelect = (style: AvatarStyle) => {
    setSelectedStyle(style);
  };

  const handleRegenerate = () => {
    setCurrentSeed(getRandomSeed(currentUser?.username || 'user'));
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      const response = await apiFetch('/api/auth/profile-completion', {
        method: 'POST',
        body: JSON.stringify({
          avatarStyle: selectedStyle,
          profileComplete: true
        })
      });

      if (response.success) {
        toast({
          title: 'Profile Complete! ⚡',
          description: 'Your digital identity is ready to rock!',
          variant: 'success',
        });
        onComplete(response.data.user);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to complete profile',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Profile completion error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-6 rounded-t-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold gradient-text mb-2">
                Choose Your Chaos Face ⚡
              </h2>
              <p className="text-muted-foreground">
                Pick your digital identity. No uploads, just pure Peve energy.
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-8">
            {/* Current Avatar Preview */}
            <div className="text-center">
              <div className="inline-block p-4 bg-card-secondary rounded-2xl border border-primary/20">
                <img
                  src={generateAvatarDataUrl(selectedStyle, currentSeed, 120)}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-full"
                />
              </div>
              <div className="mt-4">
                <GlowButton
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  className="mr-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </GlowButton>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {AVATAR_STYLES[selectedStyle].name} {AVATAR_STYLES[selectedStyle].emoji}
                </Badge>
              </div>
            </div>

            {/* Avatar Style Selection */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4 text-center">
                Pick Your Style
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(AVATAR_STYLES).map(([key, style]) => (
                  <Card
                    key={key}
                    className={`cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg ${
                      selectedStyle === key 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border hover:bg-card-secondary'
                    }`}
                    onClick={() => handleStyleSelect(key as AvatarStyle)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="mb-3">
                        <img
                          src={generateAvatarDataUrl(key as AvatarStyle, currentSeed, 80)}
                          alt={style.name}
                          className="w-16 h-16 rounded-full mx-auto"
                        />
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {style.name} {style.emoji}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {style.description}
                      </p>
                      {selectedStyle === key && (
                        <div className="mt-2">
                          <Badge variant="default" className="bg-primary text-primary-foreground">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center pt-4">
              <GlowButton
                onClick={handleComplete}
                disabled={loading}
                size="lg"
                className="px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Complete Profile
                  </>
                )}
              </GlowButton>
            </div>

            {/* Footer Note */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                You can change your avatar style later from your profile settings
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
