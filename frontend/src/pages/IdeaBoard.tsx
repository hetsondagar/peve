import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, Zap, Plus, X, Users } from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { GlowButton } from '@/components/ui/glow-button';
import UsernameLink from '@/components/UsernameLink';
import UsernameWithAvatar from '@/components/UsernameWithAvatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CompatibilityWizard from '@/components/CompatibilityWizard';
import CompatibilityCheckModal from '@/components/CompatibilityCheckModal';
import NotificationDropdown from '@/components/NotificationDropdown';
import { CommentModal } from '@/components/CommentModal';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const mockIdeas = [
  { id: 1, username: 'Sarah Chen', avatar: '🧑‍💻', title: 'AI-Powered Code Review Tool', description: 'A collaborative platform that uses AI to provide instant code reviews and suggestions', tags: ['AI', 'DevTools', 'Python'], likes: 42, comments: 12 },
  { id: 2, username: 'Mike Johnson', avatar: '👨‍🎨', title: 'Real-time Whiteboard for Remote Teams', description: 'Interactive whiteboard with video chat integration for distributed teams', tags: ['React', 'WebRTC', 'Collaboration'], likes: 35, comments: 8 },
  { id: 3, username: 'Priya Sharma', avatar: '👩‍🔬', title: 'Blockchain-Based Academic Credentials', description: 'Decentralized system for verifying and sharing educational achievements', tags: ['Blockchain', 'Web3', 'Education'], likes: 28, comments: 15 },
];

export default function IdeaBoard() {
  const navigate = useNavigate();
  const [showPostPanel, setShowPostPanel] = useState(false);
  const [ideaType, setIdeaType] = useState<'brainstorm' | 'build'>('brainstorm');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCompatibilityWizard, setShowCompatibilityWizard] = useState(false);
  const [compatibilitySetupComplete, setCompatibilitySetupComplete] = useState(false);
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedIdeaForComment, setSelectedIdeaForComment] = useState<any>(null);
  const [likedIdeas, setLikedIdeas] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });

  useEffect(() => {
    const checkCompatibilityAndFetchIdeas = async () => {
      try {
        // First check compatibility setup status
        const compatibilityResponse = await apiFetch('/api/compatibility/profile');
        const isSetupComplete = compatibilityResponse.data.compatibilitySetupComplete;
        setCompatibilitySetupComplete(isSetupComplete);
        
        // If not setup, show wizard
        if (!isSetupComplete) {
          setShowCompatibilityWizard(true);
          setLoading(false);
          return;
        }
        
        // If setup complete, fetch ideas
        const response = await apiFetch('/api/ideas');
        setIdeas(response.data.items || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIdeas([]);
      } finally {
        setLoading(false);
      }
    };

    checkCompatibilityAndFetchIdeas();
  }, []);


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitIdea = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required');
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const ideaData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags,
        mode: ideaType === 'build' ? 'want_to_build' : 'brainstorm',
        difficulty: 'beginner'
      };

      const response = await apiFetch('/api/ideas', {
        method: 'POST',
        body: JSON.stringify(ideaData)
      });

      // Reset form
      setFormData({ title: '', description: '', tags: '' });
      setShowPostPanel(false);
      
      // Refresh ideas list
      const ideasResponse = await apiFetch('/api/ideas');
      setIdeas(ideasResponse.data.items || []);
      
      alert('Idea posted successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to post idea');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompatibilityComplete = async () => {
    setShowCompatibilityWizard(false);
    setCompatibilitySetupComplete(true);
    
    // Fetch ideas after compatibility setup is complete
    try {
      const response = await apiFetch('/api/ideas');
      setIdeas(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch ideas after compatibility setup:', error);
    }
  };

  const handleWantToCollaborate = (idea: any) => {
    setSelectedIdea(idea);
    setShowCompatibilityModal(true);
  };

  const handleRequestSent = () => {
    if (selectedIdea) {
      setSentRequests(prev => new Set([...prev, selectedIdea._id]));
    }
  };

  const handleLikeIdea = async (ideaId: string) => {
    try {
      const response = await apiFetch(`/api/likes/idea/${ideaId}`, {
        method: 'POST'
      });

      if (response.success) {
        // Update local state
        setLikedIdeas(prev => {
          const newSet = new Set(prev);
          if (response.data.action === 'liked') {
            newSet.add(ideaId);
          } else {
            newSet.delete(ideaId);
          }
          return newSet;
        });

        // Update ideas list
        setIdeas(prev => prev.map((idea: any) => 
          idea._id === ideaId 
            ? { ...idea, likes: response.data.likes }
            : idea
        ));

        toast({
          title: response.data.action === 'liked' ? 'Liked!' : 'Unliked',
          description: response.data.action === 'liked' 
            ? 'You liked this idea' 
            : 'You unliked this idea',
        });
      }
    } catch (error) {
      console.error('Error liking idea:', error);
      toast({
        title: "Error",
        description: "Failed to like idea",
        variant: "destructive",
      });
    }
  };

  const handleOpenCommentModal = (idea: any) => {
    setSelectedIdeaForComment(idea);
    setShowCommentModal(true);
  };

  const handleNotificationClick = (notification: any) => {
    // Handle notification click - could navigate to specific request or idea
    console.log('Notification clicked:', notification);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      <Navbar currentPage="ideas" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Where <span className="gradient-text">peers</span> become projects</h1>
          <p className="text-muted-foreground">Share ideas, find collaborators, build the future</p>
        </motion.div>

        {/* Ideas Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading ideas...</div>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ideas.map((idea: any, index: number) => (
              <motion.div
                key={idea._id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="glass border-border hover-glow cursor-pointer group h-64 flex flex-col"
                  onClick={() => navigate(`/ideas/${idea._id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <UsernameWithAvatar
                          username={idea.author?.username || idea.author?.name || 'Unknown'}
                          userId={idea.author?._id}
                          name={idea.author?.name}
                          avatarStyle={idea.author?.avatarStyle}
                          avatarUrl={idea.author?.avatarUrl}
                          size={24}
                          variant="compact"
                          className="font-semibold text-sm"
                        />
                        <div className="text-xs text-muted-foreground">{new Date(idea.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <CardTitle className="text-sm line-clamp-2">{idea.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between pt-0">
                    <CardDescription className="text-xs line-clamp-3 mb-3">{idea.description}</CardDescription>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {idea.tags?.slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                            {tag}
                          </span>
                        ))}
                        {idea.tags?.length > 3 && (
                          <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                            +{idea.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeIdea(idea._id);
                            }}
                            className={`flex items-center gap-1 transition-colors ${
                              likedIdeas.has(idea._id)
                                ? 'text-red-500 hover:text-red-600'
                                : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${likedIdeas.has(idea._id) ? 'fill-current' : ''}`} />
                            <span className="text-xs">{idea.likes || 0}</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCommentModal(idea);
                            }}
                            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span className="text-xs">{idea.commentCount || 0}</span>
                          </button>
                        </div>
                        {idea.mode === 'want_to_build' ? (
                          sentRequests.has(idea._id) ? (
                            <GlowButton variant="outline" size="sm" className="text-xs px-2 py-1" disabled>
                              Request Sent
                            </GlowButton>
                          ) : (
                            <GlowButton 
                              variant="outline" 
                              size="sm" 
                              className="text-xs px-2 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWantToCollaborate(idea);
                              }}
                            >
                              <Users className="w-3 h-3 mr-1" />
                              Want to Collaborate
                            </GlowButton>
                          )
                        ) : (
                          <GlowButton variant="outline" size="sm" className="text-xs px-2 py-1" disabled title="This idea is still in brainstorming phase">
                            <Zap className="w-3 h-3" />
                          </GlowButton>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No ideas found. Be the first to share an idea!</div>
          </div>
        )}

        {/* Floating Pen Icon for Creating Ideas */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPostPanel(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center"
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>

        {/* Post Idea Modal */}
        {showPostPanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-6 space-y-6 border border-border w-full max-w-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Share Your Idea</h2>
                <button
                  onClick={() => setShowPostPanel(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-4">
                <GlowButton
                  variant={ideaType === 'brainstorm' ? 'default' : 'outline'}
                  onClick={() => setIdeaType('brainstorm')}
                  className="flex-1"
                >
                  Brainstorm
                </GlowButton>
                <GlowButton
                  variant={ideaType === 'build' ? 'default' : 'outline'}
                  onClick={() => setIdeaType('build')}
                  className="flex-1"
                >
                  Want to Build
                </GlowButton>
              </div>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}
              
              <Input 
                placeholder="Idea Title *" 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-11" 
              />
              <Textarea 
                placeholder="Detailed Description *" 
                rows={4} 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl" 
              />
              <Input 
                placeholder="Tags (comma-separated)" 
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl h-11" 
              />
              
              <div className="flex gap-3">
                <GlowButton 
                  variant="outline" 
                  onClick={() => {
                    setShowPostPanel(false);
                    setFormData({ title: '', description: '', tags: '' });
                    setError('');
                  }} 
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </GlowButton>
                <GlowButton 
                  onClick={handleSubmitIdea}
                  className="flex-1"
                  disabled={submitting || !formData.title.trim() || !formData.description.trim()}
                >
                  {submitting ? 'Posting...' : 'Post Idea'}
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Compatibility Setup Wizard */}
      <CompatibilityWizard
        isOpen={showCompatibilityWizard}
        onClose={() => setShowCompatibilityWizard(false)}
        onComplete={handleCompatibilityComplete}
      />

      {/* Compatibility Check Modal */}
      {selectedIdea && (
        <CompatibilityCheckModal
          isOpen={showCompatibilityModal}
          onClose={() => {
            setShowCompatibilityModal(false);
            setSelectedIdea(null);
          }}
          ideaId={selectedIdea._id}
          ideaTitle={selectedIdea.title}
          receiverId={selectedIdea.author._id}
          receiverName={selectedIdea.author.name}
          onRequestSent={handleRequestSent}
        />
      )}

      {/* Comment Modal */}
      {selectedIdeaForComment && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedIdeaForComment(null);
          }}
          targetType="idea"
          targetId={selectedIdeaForComment._id}
          targetTitle={selectedIdeaForComment.title}
          currentUserId={localStorage.getItem('peve_user_id') || undefined}
        />
      )}
    </div>
  );
}
