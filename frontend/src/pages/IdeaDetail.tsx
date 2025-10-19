import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, Bookmark, Share2, MessageCircle, 
  ExternalLink, Users, Eye, Calendar,
  Award, Tag, Code, Zap, Globe, FileText, Play, BarChart3,
  Edit3, Trash2
} from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CommentComponent } from '@/components/CommentComponent';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

export default function IdeaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [idea, setIdea] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchIdea = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [ideaResponse, userResponse] = await Promise.all([
        apiFetch(`/api/ideas/${id}/detailed`),
        apiFetch('/api/auth/me').catch(() => ({ data: null }))
      ]);
      
      if (ideaResponse.success) {
        setIdea(ideaResponse.data.idea);
        setCurrentUser(userResponse.data);
        setComments(ideaResponse.data.comments || []);
        setLikeCount(ideaResponse.data.idea.likes || 0);
        setSaveCount(ideaResponse.data.idea.saveCount || 0);
        
        // Check if user has liked/saved this idea
        try {
          const statusResponse = await apiFetch(`/api/interactions/status?targetType=idea&targetId=${id}`);
          if (statusResponse.success) {
            setIsLiked(statusResponse.data.liked || false);
            setIsSaved(statusResponse.data.saved || false);
          }
        } catch (statusError) {
          console.log('Could not fetch interaction status:', statusError);
        }
      } else {
        setError('Idea not found');
      }
    } catch (err: any) {
      console.error('Failed to fetch idea:', err);
      setError('Failed to load idea');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) {
      fetchIdea();
    }
  }, [id, navigate, fetchIdea]);

  const handleLike = async () => {
    if (!id) return;
    
    try {
      const response = await apiFetch(`/api/interactions/like/idea/${id}`, {
        method: 'POST'
      });
      
      if (response.success) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Failed to like idea:', error);
    }
  };

  const handleBookmark = async () => {
    if (!id) return;
    
    try {
      const response = await apiFetch(`/api/interactions/save/idea/${id}`, {
        method: 'POST'
      });
      
      if (response.success) {
        setIsSaved(!isSaved);
        setSaveCount(prev => isSaved ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Failed to bookmark idea:', error);
    }
  };

  const handleCommentSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newComment.trim() || !id || submittingComment) return;
    
    try {
      setSubmittingComment(true);
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: newComment.trim(),
          targetType: 'idea',
          targetId: id
        })
      });
      
      if (response.success) {
        setNewComment('');
        // Refresh comments without full page refresh
        const commentsResponse = await apiFetch(`/api/comments/idea/${id}`);
        if (commentsResponse.success) {
          setComments(commentsResponse.data.comments || []);
        }
        toast({
          title: "Comment posted!",
          description: "Your comment has been added successfully.",
        });
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleEditIdea = () => {
    // Navigate to edit idea page or open edit modal
    navigate(`/ideas/${id}/edit`);
  };

  const handleDeleteIdea = async () => {
    try {
      await apiFetch(`/api/ideas/${id}`, {
        method: 'DELETE'
      });
      
      // Redirect to ideas page after successful deletion
      navigate('/ideas');
    } catch (error) {
      console.error('Failed to delete idea:', error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowProfileDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <Navbar currentPage="ideas" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading idea...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <Navbar currentPage="ideas" />
        <div className="relative z-10 container mx-auto px-6 py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Idea Not Found</h1>
            <p className="text-muted-foreground mb-6">{error || 'The idea you are looking for does not exist.'}</p>
            <GlowButton onClick={() => navigate('/ideas')}>
              Back to Ideas
            </GlowButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      <Navbar currentPage="ideas" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <GlowButton 
                variant="outline" 
                onClick={() => navigate('/ideas')}
                className="mb-6"
              >
                ← Back to Ideas
              </GlowButton>
            </motion.div>

            {/* Idea Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        username={idea.author?.username || idea.author?.name || 'Unknown'}
                        avatarUrl={idea.author?.avatarUrl}
                        avatarStyle={idea.author?.avatarStyle}
                        size={48}
                      />
                      <div>
                        <UsernameLink
                          username={idea.author?.username || idea.author?.name || 'Unknown'}
                          userId={idea.author?._id}
                          className="text-lg font-semibold"
                        />
                        <div className="text-sm text-muted-foreground">
                          {new Date(idea.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={idea.mode === 'want_to_build' ? 'default' : 'secondary'}>
                      {idea.mode === 'want_to_build' ? 'Want to Build' : 'Brainstorm'}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-2xl mb-3">{idea.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {idea.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Comments ({comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Comment */}
                  <form onSubmit={handleCommentSubmit} className="space-y-3">
                    <Textarea
                      placeholder="Share your thoughts on this idea..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!newComment.trim() || submittingComment}
                        className="px-6"
                      >
                        {submittingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment: any) => (
                        <CommentComponent
                          key={comment._id}
                          comment={comment}
                          targetType="idea"
                          targetId={idea._id}
                          depth={0}
                          maxDepth={2}
                          onUpdate={fetchIdea}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="w-5 h-5 text-primary" />
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Skills Needed */}
            {idea.skillsNeeded && idea.skillsNeeded.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="w-5 h-5 text-primary" />
                      Skills Needed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {idea.skillsNeeded.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Idea Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Idea Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{likeCount}</div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{saveCount}</div>
                      <div className="text-sm text-muted-foreground">Saves</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{idea.views || 0}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{comments.length}</div>
                      <div className="text-sm text-muted-foreground">Comments</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass border-border">
                <CardContent className="p-6 space-y-4">
                  <GlowButton
                    onClick={handleLike}
                    variant={isLiked ? "default" : "outline"}
                    className={`w-full flex items-center gap-2 ${
                      isLiked ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'} ({likeCount})
                  </GlowButton>
                  
                  <GlowButton
                    onClick={handleBookmark}
                    variant={isSaved ? "default" : "outline"}
                    className={`w-full flex items-center gap-2 ${
                      isSaved ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' : ''
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'} ({saveCount})
                  </GlowButton>
                  
                  <GlowButton variant="outline" className="w-full flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </GlowButton>
                  
                  {/* Edit and Delete buttons for idea author */}
                  {currentUser && idea.author && currentUser._id === idea.author._id && (
                    <>
                      <GlowButton
                        variant="outline"
                        onClick={handleEditIdea}
                        className="w-full flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit Idea
                      </GlowButton>
                      <GlowButton
                        variant="outline"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center gap-2 text-red-500 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Idea
                      </GlowButton>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass border-border">
                <CardHeader>
                  <CardTitle className="text-lg">About the Author</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      username={idea.author?.username || idea.author?.name || 'Unknown'}
                      avatarUrl={idea.author?.avatarUrl}
                      avatarStyle={idea.author?.avatarStyle}
                      size={48}
                    />
                    <div>
                      <UsernameLink
                        username={idea.author?.username || idea.author?.name || 'Unknown'}
                        userId={idea.author?._id}
                        className="font-semibold"
                      />
                      {idea.author?.bio && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {idea.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {idea.author?.skills && idea.author.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {idea.author.skills.slice(0, 5).map((skill: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {idea.author.skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{idea.author.skills.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Collaboration */}
            {idea.mode === 'want_to_build' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="glass border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-5 h-5 text-primary" />
                      Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This idea is open for collaboration. Interested in building this together?
                    </p>
                    <GlowButton className="w-full">
                      Request to Collaborate
                    </GlowButton>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="glass border-red-500/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Delete Idea</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this idea? This action cannot be undone and will also delete all associated comments.
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
                onClick={handleDeleteIdea}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </GlowButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
