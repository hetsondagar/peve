import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Eye, EyeOff, User, Lock, Github, MessageSquare, Linkedin, Sparkles, RefreshCw, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GlowButton } from '@/components/ui/glow-button';
import { apiFetch } from '@/lib/api';
import { generateAvatarDataUrl, getRandomSeed, AVATAR_STYLES, type AvatarStyle } from '@/lib/avatar';
import Avatar from './Avatar';
import UsernameAutocomplete from './UsernameAutocomplete';
import UsernameTag from './UsernameTag';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdate: (updatedUser: any) => void;
}

export default function EditProfileModal({ isOpen, onClose, currentUser, onUpdate }: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUser?.username || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [githubUsername, setGithubUsername] = useState(currentUser?.githubUsername || '');
  const [discordUsername, setDiscordUsername] = useState(currentUser?.discordUsername || '');
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser?.linkedinUrl || '');
  const [avatarStyle, setAvatarStyle] = useState<AvatarStyle>(currentUser?.avatarStyle || 'botttsNeutral');
  const [currentSeed, setCurrentSeed] = useState(currentUser?.username || 'user');
  const [contributors, setContributors] = useState<string[]>(currentUser?.contributors || []);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setUsername(currentUser?.username || '');
    setFullName(currentUser?.name || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setGithubUsername(currentUser?.githubUsername || '');
    setDiscordUsername(currentUser?.discordUsername || '');
    setLinkedinUrl(currentUser?.linkedinUrl || '');
    setAvatarStyle(currentUser?.avatarStyle || 'botttsNeutral');
    setCurrentSeed(currentUser?.username || 'user');
    setContributors(currentUser?.contributors || []);
    setError('');
    onClose();
  };

  const handleRegenerateAvatar = () => {
    setCurrentSeed(getRandomSeed(currentUser?.username || 'user'));
  };

  const removeContributor = (index: number) => {
    setContributors(prev => prev.filter((_, i) => i !== index));
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';
    if (username.length > 20) return 'Username must be less than 20 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return '';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateLinkedInUrl = (url: string) => {
    if (!url) return '';
    return url.match(/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/) ? '' : 'Invalid LinkedIn URL format';
  };

  const validateDiscordUsername = (discord: string) => {
    if (!discord) return '';
    return /^[a-zA-Z0-9_.]+$/.test(discord) ? '' : 'Invalid Discord username format';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match');
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

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (username !== currentUser?.username) {
        updateData.username = username;
      }
      if (fullName !== currentUser?.name) {
        updateData.name = fullName;
      }
      if (newPassword) {
        updateData.newPassword = newPassword;
        updateData.currentPassword = currentPassword;
      }
      if (githubUsername !== currentUser?.githubUsername) {
        updateData.githubUsername = githubUsername;
      }
      if (discordUsername !== currentUser?.discordUsername) {
        updateData.discordUsername = discordUsername;
      }
      if (linkedinUrl !== currentUser?.linkedinUrl) {
        updateData.linkedinUrl = linkedinUrl;
      }
      if (avatarStyle !== currentUser?.avatarStyle) {
        updateData.avatarStyle = avatarStyle;
      }
      if (JSON.stringify(contributors) !== JSON.stringify(currentUser?.contributors || [])) {
        updateData.contributors = contributors;
      }

      const response = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        onUpdate(response.data.user);
        handleClose();
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="relative bg-card border border-border rounded-2xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Edit Profile</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-card-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-muted-foreground">Username *</label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-muted-foreground">Full Name *</label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Password
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="text-sm font-medium text-muted-foreground">Current Password</label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pr-10"
                  placeholder="Enter current password to change"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-muted-foreground">New Password</label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12 pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Github className="w-5 h-5 text-primary" />
              Social Links
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="githubUsername" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub Username
                </label>
                <Input
                  id="githubUsername"
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                  placeholder="e.g., octocat"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="discordUsername" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Discord Username
                </label>
                <Input
                  id="discordUsername"
                  type="text"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                  placeholder="e.g., username#1234"
                />
                <p className="text-xs text-muted-foreground">Optional - for gaming and community collaboration</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="linkedinUrl" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile URL
                </label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-12"
                  placeholder="https://linkedin.com/in/yourname"
                />
              </div>
            </div>
          </div>

          {/* Contributors Section */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Contributors
            </h3>
            
            <div className="space-y-3">
              <UsernameAutocomplete
                onSelect={(username) => {
                  if (!contributors.includes(username)) {
                    setContributors(prev => [...prev, username]);
                  }
                }}
                selectedUsernames={contributors}
                placeholder="Search for Peve usernames..."
                disabled={loading}
              />
              
              {/* Selected contributors */}
              {contributors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {contributors.map((contributor, index) => (
                    <UsernameTag
                      key={index}
                      username={contributor}
                      onRemove={() => removeContributor(index)}
                    />
                  ))}
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                💡 Add Peve usernames to showcase your collaboration network. Start typing to search.
              </p>
            </div>
          </div>

          {/* Avatar Style */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Avatar Style
            </h3>
            <div className="text-center">
              <div className="inline-block p-4 bg-card-secondary rounded-2xl border border-primary/20">
                <Avatar 
                  username={currentSeed} 
                  avatarStyle={avatarStyle} 
                  size={80} 
                />
              </div>
              <div className="mt-3">
                <GlowButton
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerateAvatar}
                  className="mr-2"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </GlowButton>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(AVATAR_STYLES).map(([key, style]) => (
                <div
                  key={key}
                  className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                    avatarStyle === key 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:bg-card-secondary'
                  }`}
                  onClick={() => setAvatarStyle(key as AvatarStyle)}
                >
                  <div className="text-center">
                    <Avatar 
                      username={currentSeed} 
                      avatarStyle={key as AvatarStyle} 
                      size={40} 
                      className="mx-auto mb-2"
                    />
                    <p className="text-xs font-medium text-foreground">
                      {style.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {style.emoji}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <GlowButton
              type="submit"
              size="lg"
              disabled={loading || (!username && !fullName && !newPassword && !githubUsername && !discordUsername && !linkedinUrl && avatarStyle === currentUser?.avatarStyle && JSON.stringify(contributors) === JSON.stringify(currentUser?.contributors || []))}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </GlowButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
