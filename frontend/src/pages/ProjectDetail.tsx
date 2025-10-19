import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, User, X, Heart, Bookmark, Share2, MessageCircle, 
  ExternalLink, Github, Users, Eye, Calendar,
  Award, Tag, Code, Zap, Globe, FileText, Play, BarChart3,
  Edit3, Trash2
} from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { apiFetch } from '@/lib/api';
import SearchBar from '@/components/SearchBar';
import { requireAuth } from '@/utils/auth';
import { CommentComponent } from '@/components/CommentComponent';
import UsernameTag from '@/components/UsernameTag';
import UsernameWithAvatar from '@/components/UsernameWithAvatar';

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

  const handleDeleteProject = async () => {
    try {
      await apiFetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      // Redirect to projects page after successful deletion
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
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

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Cover Image */}
              {project.coverImage?.url && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-primary">
                  <img 
                    src={project.coverImage.url} 
                    alt={project.title}
                    className="w-full h-full object-cover"
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <UsernameWithAvatar
                        username={project.author?.username || project.author?.name || 'Unknown'}
                        userId={project.author?._id}
                        name={project.author?.name}
                        avatarStyle={project.author?.avatarStyle}
                        avatarUrl={project.author?.avatarUrl}
                        size={40}
                        variant="detailed"
                        showFullName={true}
                        className="flex-1"
                      />
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Project Owner</p>
                      </div>
                    </div>
                    {project.contributors?.map((contributor: any, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <UsernameWithAvatar
                          username={contributor.user?.username || contributor.user?.name || 'Unknown'}
                          userId={contributor.user?._id}
                          name={contributor.user?.name}
                          avatarStyle={contributor.user?.avatarStyle}
                          avatarUrl={contributor.user?.avatarUrl}
                          size={40}
                          variant="detailed"
                          className="flex-1"
                        />
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{contributor.role}</p>
                        </div>
                      </div>
                    ))}
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
          <div className="lg:col-span-1 space-y-6">
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

      {/* Collaboration Modal */}
      <Dialog open={showCollaborationModal} onOpenChange={setShowCollaborationModal}>
        <DialogContent className="glass border-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Collaborate</DialogTitle>
          </DialogHeader>
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
            <p className="text-muted-foreground">
              Edit functionality is coming soon! For now, you can delete and recreate your project with the updated information.
            </p>
            <div className="flex gap-2">
              <GlowButton 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Close
              </GlowButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
