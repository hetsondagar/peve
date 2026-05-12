import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, User, X, Heart, Bookmark, Share2, MessageCircle, 
  ExternalLink, Github, Users, Eye, Calendar,
  Award, Tag, Code, Zap, Globe, FileText, Play, BarChart3,
  Edit3, Trash2, Sparkles, Loader2, RefreshCw, GitCommit
} from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { apiFetch } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import EditProjectForm from '@/components/EditProjectForm';
import { requireAuth } from '@/utils/auth';
import { CommentComponent } from '@/components/CommentComponent';
import UsernameTag from '@/components/UsernameTag';
import UsernameWithAvatar from '@/components/UsernameWithAvatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [collaborationMessage, setCollaborationMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [commentText, setCommentText] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRepoIntelModal, setShowRepoIntelModal] = useState(false);
  const [repoIntelLoading, setRepoIntelLoading] = useState(false);
  const [repoIntelData, setRepoIntelData] = useState<any>(null);
  const [repoIntelMessage, setRepoIntelMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchProject = useCallback(async () => {
    try {
      const [projectResponse, commentsResponse, userResponse] = await Promise.all([
        apiFetch(`/api/projects/${id}`),
        apiFetch(`/api/comments/project/${id}`),
        apiFetch('/api/auth/me').catch(() => ({ data: null }))
      ]);
      
      const projectData = projectResponse.data.project;
      console.log('Project data:', projectData);
      console.log('Project metrics:', projectData.metrics);
      setProject(projectData);
      setComments(commentsResponse.data?.comments || []);
      setLikeCount(projectData.metrics?.likes || 0);
      setSaveCount(projectData.metrics?.saves || 0);
      setCurrentUser(userResponse.data);
      
      // Fetch interaction status
      try {
        const interactionResponse = await apiFetch('/api/interactions/status', {
          method: 'POST',
          body: JSON.stringify({
            items: [{
              targetType: 'project',
              targetId: id
            }]
          })
        });
        
        if (interactionResponse.success && interactionResponse.data.length > 0) {
          const status = interactionResponse.data[0];
          setIsLiked(status.isLiked);
          setIsBookmarked(status.isSaved);
        }
      } catch (interactionError) {
        console.error('Failed to fetch interaction status:', interactionError);
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, navigate, fetchProject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!requireAuth()) {
      return;
    }

    try {
      const response = await apiFetch(`/api/interactions/like/project/${id}`, { method: 'POST' });
      if (response.success) {
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
        if (project) {
          setProject({
            ...project,
            metrics: {
              ...project.metrics,
              likes: response.data.likeCount
            }
          });
        }
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed')) {
        // Don't show error, just log it
        console.warn('Authentication required for liking projects');
        return;
      } else {
        console.error('Failed to like project:', error);
      }
    }
  };

  const handleBookmark = async () => {
    if (!requireAuth()) {
      return;
    }

    try {
      const response = await apiFetch(`/api/interactions/save/project/${id}`, { method: 'POST' });
      if (response.success) {
        setIsBookmarked(response.data.isSaved);
        if (response.data.saveCount !== undefined) {
          setSaveCount(response.data.saveCount);
        }
        if (project && response.data.saveCount !== undefined) {
          setProject({
            ...project,
            metrics: {
              ...project.metrics,
              saves: response.data.saveCount
            }
          });
        }
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed')) {
        // Don't show error, just log it
        console.warn('Authentication required for bookmarking projects');
        return;
      } else {
        console.error('Failed to bookmark project:', error);
      }
    }
  };

  const handleShare = async () => {
    try {
      const response = await apiFetch(`/api/projects/${id}/share`, { method: 'POST' });
      if (navigator.share) {
        await navigator.share({
          title: project?.title,
          text: project?.tagline,
          url: response.data.shareUrl
        });
      } else {
        await navigator.clipboard.writeText(response.data.shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share project:', error);
    }
  };

  const handleEditProject = () => {
    // Open edit modal instead of navigating
    setShowEditModal(true);
  };

  const loadRepositoryIntelligence = useCallback(async (options?: { keepPrevious?: boolean }) => {
    if (!id) return;
    setRepoIntelLoading(true);
    if (!options?.keepPrevious) {
      setRepoIntelData(null);
    }
    setRepoIntelMessage('');
    try {
      const res = (await apiFetch(`/api/projects/${id}/repository-insights`)) as {
        data?: unknown;
        message?: string;
      };
      setRepoIntelData(res.data ?? null);
      setRepoIntelMessage(typeof res.message === 'string' ? res.message : '');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not load repository intelligence';
      setRepoIntelMessage(msg);
    } finally {
      setRepoIntelLoading(false);
    }
  }, [id]);

  const openRepositoryIntelligence = () => {
    setShowRepoIntelModal(true);
    void loadRepositoryIntelligence();
  };

  const refreshRepositoryIntelligence = () => {
    void loadRepositoryIntelligence({ keepPrevious: true });
  };

  const handleDeleteProject = async () => {
    try {
      setLoading(true);
      console.log('Deleting project with ID:', id);
      const response = await apiFetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      console.log('Delete response:', response);
      
      if (response.success) {
        // Close confirmation dialog
        setShowDeleteConfirm(false);
        // Redirect to projects page after successful deletion
        navigate('/projects');
      } else {
        throw new Error(response.error || 'Failed to delete project');
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
      console.error('Error message:', error.message);
      console.error('Project ID:', id);
      alert(error.message || 'Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollaborationRequest = async () => {
    try {
      await apiFetch(`/api/projects/${id}/collaborate`, {
        method: 'POST',
        body: JSON.stringify({
          message: collaborationMessage,
          role: selectedRole
        })
      });
      setShowCollaborationModal(false);
      setCollaborationMessage('');
      setSelectedRole('');
      alert('Collaboration request sent successfully!');
    } catch (error) {
      console.error('Failed to send collaboration request:', error);
    }
  };

  const handleCommentSubmit = async () => {
    const commentToSubmit = newComment.trim() || commentText.trim();
    if (!commentToSubmit) return;
    
    try {
      const response = await apiFetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: commentToSubmit,
          targetType: 'project',
          targetId: id
        })
      });
      
      if (response.success) {
        // Add the new comment to the comments list
        setComments(prev => [response.data, ...prev]);
        setNewComment('');
        setCommentText('');
        
        // Update project metrics
        if (project) {
          setProject(prev => ({
            ...prev,
            metrics: {
              ...prev.metrics,
              comments: (prev.metrics?.comments || 0) + 1
            }
          }));
        }
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Project not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 navbar">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img src={'/final.png'} alt="peve" className="w-12 h-12" />
                <button onClick={() => navigate('/home')} className="text-2xl font-bold brand-peve">peve</button>
              </div>
              <div className="hidden md:flex gap-6">
                <button onClick={() => navigate('/home')} className="text-muted-foreground hover:text-primary transition-colors">Explore</button>
                <button onClick={() => navigate('/ideas')} className="text-muted-foreground hover:text-primary transition-colors">Ideas</button>
                <button onClick={() => navigate('/projects')} className="text-primary">Projects</button>
                <button onClick={() => navigate('/codetalks')} className="text-muted-foreground hover:text-primary transition-colors">CodeTalks</button>
                <button onClick={() => navigate('/leaderboard')} className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl glass border border-border p-2 z-50">
                    <button onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Profile</button>
                    <button onClick={() => { navigate('/codetalks'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">CodeTalks</button>
                    <button onClick={() => { localStorage.removeItem('peve_token'); navigate('/login'); setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Log out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto min-w-0 px-6 py-12">
        <div className="grid min-w-0 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="min-w-0 lg:col-span-2 space-y-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="min-w-0 space-y-6"
            >
              {/* Cover Image — min-w-0 + max-w-full avoids grid overflow clipping */}
              {project.coverImage?.url && (
                <div className="flex w-full min-w-0 justify-center">
                  <img
                    src={project.coverImage.url}
                    alt={project.title}
                    className="block h-auto w-auto max-w-full rounded-2xl"
                  />
                </div>
              )}

              {/* Title & Tagline */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">{project.title}</h1>
                    <p className="text-xl text-muted-foreground">{project.tagline}</p>
                  </div>
                  <div className="flex gap-2">
                    <GlowButton
                      variant={isLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLike}
                      className="flex items-center gap-2"
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {likeCount}
                    </GlowButton>
                    <GlowButton
                      variant={isBookmarked ? "default" : "outline"}
                      size="sm"
                      onClick={handleBookmark}
                      className="flex items-center gap-2"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      {saveCount}
                    </GlowButton>
                    <GlowButton
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      {project.metrics?.shares || 0}
                    </GlowButton>
                    
                    {/* Edit and Delete buttons for project author */}
                    {currentUser && project.author && currentUser._id === project.author._id && (
                      <>
                        <GlowButton
                          variant="outline"
                          size="sm"
                          onClick={handleEditProject}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </GlowButton>
                        <GlowButton
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center gap-2 text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </GlowButton>
                      </>
                    )}
                  </div>
                </div>

                {/* Project Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {project.metrics?.views || 0} views
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <GlowButton
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openRepositoryIntelligence}
                    className="gap-2 border-primary/40 bg-primary/5 hover:bg-primary/10"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Repository intelligence
                  </GlowButton>
                </div>
              </div>

              {/* Contributors */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {/* Project Owner */}
                    <div className="flex items-center gap-3">
                      <UsernameWithAvatar
                        username={project.author?.username || project.author?.name || 'Unknown'}
                        userId={project.author?._id}
                        name={project.author?.name}
                        avatarStyle={project.author?.avatarStyle}
                        avatarUrl={project.author?.avatarUrl}
                        size={40}
                        variant="detailed"
                        showFullName={true}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Project Owner</p>
                      </div>
                    </div>
                    
                    {/* Contributors */}
                    {project.contributors && project.contributors.length > 0 && (
                      <>
                        <div className="border-t border-border pt-4">
                          <h4 className="text-sm font-semibold text-foreground mb-3">Contributors</h4>
                          <div className="flex flex-col gap-2">
                            {project.contributors.map((contributor: any, index: number) => {
                              const displayName = contributor.user
                                ? (contributor.user?.name || contributor.user?.username || 'Contributor')
                                : (contributor.name || 'Contributor');
                              return (
                                <div key={index} className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{displayName}</span>
                                  {contributor.role && (
                                    <span className="text-xs text-muted-foreground">• {contributor.role}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Collaboration */}
                    {project.collaboration && (
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.collaboration.openToCollaboration && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Open to Collaboration</h4>
                        {project.collaboration.lookingForRoles && project.collaboration.lookingForRoles.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-muted-foreground mb-2">Looking for:</p>
                            <div className="flex flex-wrap gap-2">
                              {project.collaboration.lookingForRoles.map((role: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Contributors */}
                    {project.contributors && project.contributors.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Contributors</h4>
                        <div className="flex flex-col gap-2">
                          {project.contributors.map((contributor: any, index: number) => {
                            const displayName = contributor.user
                              ? (contributor.user?.name || contributor.user?.username || 'Contributor')
                              : (contributor.name || 'Contributor');
                            return (
                              <div key={index} className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{displayName}</span>
                                {contributor.role && (
                                  <span className="text-xs text-muted-foreground">• {contributor.role}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {project.collaboration.teammates && project.collaboration.teammates.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Team Members</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.collaboration.teammates.map((teammate: string, index: number) => (
                            <UsernameTag
                              key={index}
                              username={teammate}
                              clickable={true}
                              variant="outline"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Overview */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </CardContent>
              </Card>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-primary" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {project.keyFeatures.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech: string, index: number) => (
                      <Badge key={index} variant="teal" className="flex items-center gap-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Links */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Links & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.links?.githubRepo && (
                      <a
                        href={project.links.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-secondary hover:bg-primary/10 transition-colors"
                      >
                        <Github className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">GitHub Repository</p>
                          <p className="text-sm text-muted-foreground">View source code</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                      </a>
                    )}
                    {project.links?.liveDemo && (
                      <a
                        href={project.links.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-secondary hover:bg-primary/10 transition-colors"
                      >
                        <Globe className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">Live Demo</p>
                          <p className="text-sm text-muted-foreground">Try it out</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                      </a>
                    )}
                    {project.links?.documentation && (
                      <a
                        href={project.links.documentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-secondary hover:bg-primary/10 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">Documentation</p>
                          <p className="text-sm text-muted-foreground">Read the docs</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                      </a>
                    )}
                    {project.links?.videoDemo && (
                      <a
                        href={project.links.videoDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-card-secondary hover:bg-primary/10 transition-colors"
                      >
                        <Play className="w-5 h-5 text-foreground" />
                        <div>
                          <p className="font-semibold text-foreground">Video Demo</p>
                          <p className="text-sm text-muted-foreground">Watch demo</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              {project.badges && project.badges.length > 0 && (
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      Badges Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.badges.map((badge: string, index: number) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Comments ({project.metrics?.comments || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts about this project..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <GlowButton 
                        size="sm" 
                        onClick={handleCommentSubmit}
                        disabled={!newComment.trim()}
                      >
                        Post Comment
                      </GlowButton>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {Array.isArray(comments) && comments.length > 0 ? (
                      comments.map((comment) => (
                        <CommentComponent
                          key={comment._id}
                          comment={comment}
                          targetType="project"
                          targetId={project._id}
                          depth={0}
                          maxDepth={2}
                          onUpdate={() => {
                            // Refresh comments
                            const fetchComments = async () => {
                              try {
                                const response = await apiFetch(`/api/comments/project/${id}`);
                                setComments(response.data?.comments || []);
                              } catch (error) {
                                console.error('Failed to fetch comments:', error);
                              }
                            };
                            fetchComments();
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No comments yet. Be the first to comment!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="min-w-0 lg:col-span-1 space-y-6">
            {/* Project Info */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle>Project Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Category</p>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Difficulty</p>
                  <Badge variant="outline" className="capitalize">{project.difficultyLevel}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Stage</p>
                  <Badge variant="outline" className="capitalize">{project.developmentStage}</Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Status</p>
                  <Badge variant="outline" className="capitalize">{project.status}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="glass border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Project Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-card-secondary">
                    <div className="text-2xl font-bold text-primary">{likeCount}</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card-secondary">
                    <div className="text-2xl font-bold text-primary">{saveCount}</div>
                    <div className="text-sm text-muted-foreground">Saves</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card-secondary">
                    <div className="text-2xl font-bold text-primary">{project.metrics?.views || 0}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card-secondary">
                    <div className="text-2xl font-bold text-primary">{project.metrics?.comments || 0}</div>
                    <div className="text-sm text-muted-foreground">Comments</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Collaboration */}
            {project.collaboration?.openToCollaboration && (
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Open to Collaboration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Looking for:</p>
                    <div className="flex flex-wrap gap-1">
                      {project.collaboration.lookingForRoles?.map((role: string, index: number) => (
                        <Badge key={index} variant="teal" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <GlowButton 
                    className="w-full" 
                    onClick={() => setShowCollaborationModal(true)}
                  >
                    Request to Collaborate
                  </GlowButton>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card className="glass border-border sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Comments ({project.metrics?.comments || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Comment Input */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Share your thoughts about this project..."
                    className="min-h-[100px] bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl resize-none"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <GlowButton
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim()}
                      className="px-6"
                    >
                      Post Comment
                    </GlowButton>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {comments.length > 0 ? (
                    comments.map((comment: any) => (
                      <CommentComponent
                        key={comment._id}
                        comment={comment}
                        targetType="project"
                        targetId={project._id}
                        depth={0}
                        maxDepth={2}
                        onUpdate={fetchProject}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Repository intelligence — live GitHub signals (no code stored) */}
      <Dialog open={showRepoIntelModal} onOpenChange={setShowRepoIntelModal}>
        <DialogContent className="glass border-primary/20 max-w-3xl max-h-[90vh] overflow-y-auto text-left">
          <DialogHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:pr-8">
              <div>
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <Sparkles className="w-5 h-5 text-primary shrink-0" />
                  Repository intelligence
                </DialogTitle>
                <DialogDescription>
                  Signals derived from public GitHub metadata and README. Source code is not persisted on Peve.
                </DialogDescription>
              </div>
              {repoIntelData && (
                <GlowButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-2"
                  disabled={repoIntelLoading}
                  onClick={() => refreshRepositoryIntelligence()}
                >
                  {repoIntelLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Refresh
                </GlowButton>
              )}
            </div>
          </DialogHeader>

          {repoIntelLoading && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Pulling repository structure and languages…</p>
            </div>
          )}

          {!repoIntelLoading && !repoIntelData && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                {repoIntelMessage ||
                  'Link a GitHub repository on this project to unlock intelligence visualizations.'}
              </p>
              {project.links?.githubRepo && (
                <p className="text-xs text-muted-foreground break-all">
                  Current link: {project.links.githubRepo}
                </p>
              )}
            </div>
          )}

          {!repoIntelLoading && repoIntelData && (
            <div className="space-y-6 text-foreground">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    Peve score preview
                  </p>
                  <p className="mt-1 text-4xl font-bold tabular-nums">
                    {repoIntelData.peveScorePreview}
                    <span className="text-lg font-normal text-muted-foreground">/100</span>
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {repoIntelData.scoreRationale}
                  </p>
                  {repoIntelData.intelligence && (
                    <p className="mt-2 text-[10px] text-primary/90 leading-snug">
                      Headline score blends heuristic GitHub signals with the ML service when{' '}
                      <code className="text-primary/80">ML_SERVICE_URL</code> is configured on the API.
                    </p>
                  )}
                </div>
                <div className="rounded-xl border border-border bg-card-secondary/50 p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Repository pulse</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stars</span>
                      <p className="font-semibold">{Number(repoIntelData.stars || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forks</span>
                      <p className="font-semibold">{Number(repoIntelData.forks || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Open issues</span>
                      <p className="font-semibold">{Number(repoIntelData.openIssues || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Watchers</span>
                      <p className="font-semibold">{Number(repoIntelData.watchers || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Default branch:{' '}
                    <span className="text-foreground font-mono">{repoIntelData.defaultBranch}</span>
                  </p>
                  {repoIntelData.repoCreatedAt && (
                    <p className="text-xs text-muted-foreground">
                      Repo created:{' '}
                      <span className="text-foreground">
                        {new Date(repoIntelData.repoCreatedAt as string).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {repoIntelData.intelligence && (
                <div className="space-y-4 rounded-xl border border-secondary/25 bg-secondary/5 p-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-secondary" />
                    ML layer (Peve ML service)
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Sentence Transformers embeddings, sklearn scoring, optional summarization, and Matplotlib
                    chart — no full source tree stored.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Model-assisted score</p>
                      <p className="text-2xl font-bold text-secondary tabular-nums">
                        {(repoIntelData.intelligence as { peve_score_ml?: number }).peve_score_ml ?? '—'}
                        <span className="text-sm font-normal text-muted-foreground">/100</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {(repoIntelData.intelligence as { score_rationale_ml?: string }).score_rationale_ml}
                      </p>
                    </div>
                    {(repoIntelData.intelligence as { score_breakdown?: Record<string, number> }).score_breakdown && (
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        {Object.entries(
                          (repoIntelData.intelligence as { score_breakdown: Record<string, number> }).score_breakdown
                        ).map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-2 border-b border-border/50 pb-1">
                            <span className="text-muted-foreground capitalize">{k.replace(/_/g, ' ')}</span>
                            <span className="font-mono text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {(repoIntelData.intelligence as { technical_summary?: string | null }).technical_summary && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-1">Technical summary</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {(repoIntelData.intelligence as { technical_summary: string }).technical_summary}
                      </p>
                    </div>
                  )}
                  {(repoIntelData.intelligence as { project_soul?: string[] }).project_soul?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Project soul</p>
                      <ul className="space-y-2">
                        {(repoIntelData.intelligence as { project_soul: string[] }).project_soul.map(
                          (line: string, i: number) => (
                            <li key={i} className="text-sm text-muted-foreground leading-relaxed border-l-2 border-secondary/40 pl-3">
                              {line}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : null}
                  {(repoIntelData.intelligence as { architecture_hints?: string[] }).architecture_hints?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Architecture hints</p>
                      <ul className="space-y-1">
                        {(repoIntelData.intelligence as { architecture_hints: string[] }).architecture_hints.map(
                          (line: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <span className="text-secondary shrink-0">→</span>
                              <span>{line}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  ) : null}
                  {(repoIntelData.intelligence as { chart_language_mix_png_base64?: string | null })
                    .chart_language_mix_png_base64 && (
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">ML language chart (Matplotlib)</p>
                      <img
                        src={`data:image/png;base64,${(repoIntelData.intelligence as { chart_language_mix_png_base64: string }).chart_language_mix_png_base64}`}
                        alt="Language mix"
                        className="w-full max-h-48 object-contain rounded-lg border border-border bg-card-secondary/40"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Language mix (bytes)
                </h4>
                <div className="h-64 w-full min-w-0 rounded-xl border border-border bg-card-secondary/30 p-2">
                  {(() => {
                    const chartData = Object.entries(repoIntelData.languageBytes || {})
                      .map(([name, value]) => ({ name, value: Number(value) || 0 }))
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 12);
                    if (chartData.length === 0) {
                      return (
                        <p className="text-sm text-muted-foreground p-4">No language data from GitHub.</p>
                      );
                    }
                    return (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={chartData} margin={{ left: 4, right: 12, top: 8, bottom: 8 }}>
                          <XAxis type="number" hide />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={88}
                            tick={{ fill: 'hsl(0 0% 78%)', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            formatter={(v: number) => [`${v.toLocaleString()} bytes`, '']}
                            contentStyle={{
                              background: 'hsl(210 20% 10%)',
                              border: '1px solid hsl(210 20% 22%)',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {chartData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={`hsl(180 100% ${Math.max(28, 52 - i * 3)}% / 0.9)`}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    );
                  })()}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Engineering signals</h4>
                <ul className="space-y-2">
                  {(repoIntelData.networkSignals || []).length ? (
                    repoIntelData.networkSignals.map((line: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary shrink-0">▹</span>
                        <span>{line}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground">No extra structural signals detected.</li>
                  )}
                </ul>
              </div>

              {(repoIntelData.commitTimeline || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <GitCommit className="w-4 h-4 text-primary" />
                    Recent evolution (commits)
                  </h4>
                  <div className="relative ml-2.5 space-y-4 border-l-2 border-primary/25 py-1 pl-5">
                    {(
                      repoIntelData.commitTimeline as {
                        sha: string;
                        message: string;
                        date: string;
                        author?: string;
                      }[]
                    )
                      .slice(0, 14)
                      .map((c, i) => (
                        <div key={`${c.sha}-${i}`} className="relative">
                          <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border border-primary/40 bg-primary/80 shadow-[0_0_10px_hsl(180_100%_46%/0.45)]" />
                          <p className="text-[11px] font-mono text-muted-foreground">
                            {c.sha}
                            {c.date ? ` · ${new Date(c.date).toLocaleDateString()}` : ''}
                          </p>
                          <p className="text-sm text-foreground leading-snug">{c.message}</p>
                          {c.author ? (
                            <p className="text-xs text-muted-foreground mt-0.5">{c.author}</p>
                          ) : null}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {(repoIntelData.contributorLeaders || []).length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Top contributors (GitHub)
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(
                      repoIntelData.contributorLeaders as {
                        login: string;
                        contributions: number;
                        avatarUrl?: string;
                      }[]
                    )
                      .slice(0, 10)
                      .map((u) => (
                        <a
                          key={u.login}
                          href={`https://github.com/${u.login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-border bg-card-secondary/40 px-2 py-1.5 text-xs text-foreground transition-colors hover:border-primary/40"
                        >
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-primary/20" />
                          )}
                          <span className="font-medium">{u.login}</span>
                          <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                            {u.contributions}
                          </Badge>
                        </a>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2 items-center justify-between border-t border-border pt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="capitalize">
                    {repoIntelData.difficultyLevel}
                  </Badge>
                  <Badge variant="teal" className="capitalize">
                    {repoIntelData.developmentStage}
                  </Badge>
                  {(repoIntelData.topics || []).slice(0, 8).map((t: string) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <GlowButton variant="outline" size="sm" asChild>
                  <a href={repoIntelData.htmlUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Github className="w-4 h-4" />
                    Open on GitHub
                  </a>
                </GlowButton>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Collaboration Modal */}
      <Dialog open={showCollaborationModal} onOpenChange={setShowCollaborationModal}>
        <DialogContent className="glass border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Collaborate</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Send a request to the project owner with your role and a message.
          </DialogDescription>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-card-secondary border border-primary/20 focus:border-primary focus:glow-subtle"
              >
                <option value="">Select a role</option>
                {project.collaboration?.lookingForRoles?.map((role: string) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Message</label>
              <Textarea
                placeholder="Tell them why you'd like to collaborate..."
                value={collaborationMessage}
                onChange={(e) => setCollaborationMessage(e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl"
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <GlowButton variant="outline" onClick={() => setShowCollaborationModal(false)} className="flex-1">
                Cancel
              </GlowButton>
              <GlowButton onClick={handleCollaborationRequest} className="flex-1">
                Send Request
              </GlowButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="glass border-red-500/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the project and its comments.
          </DialogDescription>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this project? This action cannot be undone and will also delete all associated comments.
            </p>
            <div className="flex gap-2">
              <GlowButton 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </GlowButton>
              <GlowButton 
                onClick={handleDeleteProject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </GlowButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="glass border-primary/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {project && (
              <EditProjectForm 
                project={project} 
                onSave={(updatedProject) => {
                  setProject(updatedProject);
                  setShowEditModal(false);
                }}
                onCancel={() => setShowEditModal(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
