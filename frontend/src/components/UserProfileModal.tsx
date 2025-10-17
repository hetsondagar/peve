import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, MessageSquare, Linkedin, Calendar, MapPin, Building, ExternalLink } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import Avatar from './Avatar';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(`/api/users/${userId}`);
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-card-secondary rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : user ? (
              <>
                {/* Profile Header */}
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-card-secondary rounded-2xl border border-primary/20">
                    <Avatar 
                      username={user.username || 'user'} 
                      avatarStyle={user.avatarStyle || 'botttsNeutral'} 
                      size={96} 
                      className="mx-auto"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold gradient-text">{user.name || user.username}</h2>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  {user.college && (
                    <div className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg">
                      <Building className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">College</p>
                        <p className="text-sm text-muted-foreground">{user.college}</p>
                      </div>
                    </div>
                  )}

                  {user.role && (
                    <div className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Role</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                  )}

                  {user.skills && user.skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="space-y-3">
                    {user.githubUsername && (
                      <a
                        href={`https://github.com/${user.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg hover:bg-card-secondary/80 transition-colors"
                      >
                        <Github className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">GitHub</p>
                          <p className="text-sm text-muted-foreground">@{user.githubUsername}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}

                    {user.discordUsername && (
                      <div className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Discord</p>
                          <p className="text-sm text-muted-foreground">{user.discordUsername}</p>
                        </div>
                      </div>
                    )}

                    {user.linkedinUrl && (
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg hover:bg-card-secondary/80 transition-colors"
                      >
                        <Linkedin className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">LinkedIn</p>
                          <p className="text-sm text-muted-foreground">Professional Profile</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      </a>
                    )}
                  </div>

                  {/* Join Date */}
                  <div className="flex items-center gap-3 p-3 bg-card-secondary rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Joined</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">User not found</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
