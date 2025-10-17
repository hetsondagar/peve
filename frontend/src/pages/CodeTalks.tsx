import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, 
  ThumbsUp, ThumbsDown, Zap, TrendingUp, Users, Clock
} from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InteractionButtons } from '@/components/InteractionButtons';
import { apiFetch } from '@/lib/api';
import { CommentComponent } from '@/components/CommentComponent';
import Navbar from '@/components/Navbar';

export default function CodeTalks() {
  const [prompt, setPrompt] = useState<any>(null);
  const [votes, setVotes] = useState<any>({
    agree: 0,
    disagree: 0,
    yes: 0,
    no: 0,
    total: 0
  });
  const [userVote, setUserVote] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTodaysPrompt();
  }, []);


  const fetchTodaysPrompt = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFetch('/api/prompts/today');
      console.log('Today\'s prompt response:', response);
      if (response.success) {
        setPrompt(response.data.prompt);
        setVotes(response.data.votes);
        setUserVote(response.data.userVote);
        setComments(response.data.comments || []);
        console.log('Prompt data:', response.data.prompt);
        console.log('Votes data:', response.data.votes);
      } else {
        setError(response.error || 'Failed to fetch today\'s prompt');
      }
    } catch (error) {
      console.error('Failed to fetch today\'s prompt:', error);
      setError('Failed to fetch today\'s prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: string) => {
    if (!prompt || voting) return;
    
    console.log('Voting:', { voteType, promptId: prompt._id });
    
    try {
      setVoting(true);
      setError(null);
      const response = await apiFetch(`/api/prompts/${prompt._id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteType })
      });
      
      console.log('Vote response:', response);
      
      if (response.success) {
        setUserVote(response.data.vote);
        setVotes(response.data.votes);
        setSuccess('Vote recorded successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to vote');
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      setError('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !prompt || submittingComment) return;
    
    try {
      setSubmittingComment(true);
      setError(null);
      const response = await apiFetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({
          content: commentText.trim(),
          targetType: 'prompt',
          targetId: prompt._id
        })
      });
      
      if (response.success) {
        setComments(prev => [response.data, ...prev]);
        setCommentText('');
        setSuccess('Comment posted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      setError('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (!prompt) return;
    
    try {
      const shareData = {
        title: `CodeTalks: ${prompt.question}`,
        text: `Check out today's dev discussion on Peve!`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Loading today's thought experiment...</div>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">No prompt available today</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <NetworkBackground />
      
      <Navbar currentPage="codetalks" />

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Error/Success Messages */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto mb-6"
          >
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg">
              {success}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold gradient-text">CodeTalks</h1>
            </div>
            <p className="text-xl text-muted-foreground">Today's Thought Experiment</p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Daily Discussion</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{votes.total || 0} votes</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Main Prompt Card */}
          <Card className="glass border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">{prompt.category}</Badge>
                  <Badge variant="outline" className="capitalize">{prompt.type}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Live Discussion</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-foreground leading-relaxed">
                  {prompt.question}
                </h2>
                
                {/* Poll Options */}
                {prompt.type === 'poll' && prompt.options && (
                  <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                    {prompt.options.map((option: string, index: number) => (
                      <GlowButton
                        key={index}
                        variant="outline"
                        className="w-full"
                        onClick={() => handleVote('option')}
                        disabled={voting}
                      >
                        {option}
                      </GlowButton>
                    ))}
                  </div>
                )}
              </div>

              {/* Voting Buttons */}
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={userVote?.voteType === 'agree' ? { 
                    scale: [1, 1.02, 1],
                    boxShadow: ["0 0 0 0 rgba(34, 197, 94, 0.4)", "0 0 0 10px rgba(34, 197, 94, 0)", "0 0 0 0 rgba(34, 197, 94, 0)"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GlowButton
                    variant={userVote?.voteType === 'agree' ? 'default' : 'outline'}
                    onClick={() => handleVote('agree')}
                    disabled={voting}
                    className={`flex items-center gap-2 min-w-[120px] ${
                      userVote?.voteType === 'agree' 
                        ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                        : 'hover:bg-green-500/10 hover:border-green-500/50'
                    }`}
                  >
                    <motion.div
                      animate={voting && userVote?.voteType === 'agree' ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </motion.div>
                    <span>Agree</span>
                    <motion.span
                      key={votes.agree || 0}
                      initial={{ scale: 1.3, y: -5 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 15,
                        duration: 0.4 
                      }}
                      className="font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full"
                    >
                      {votes.agree || 0}
                    </motion.span>
                  </GlowButton>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={userVote?.voteType === 'disagree' ? { 
                    scale: [1, 1.02, 1],
                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0.4)", "0 0 0 10px rgba(239, 68, 68, 0)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GlowButton
                    variant={userVote?.voteType === 'disagree' ? 'default' : 'outline'}
                    onClick={() => handleVote('disagree')}
                    disabled={voting}
                    className={`flex items-center gap-2 min-w-[120px] ${
                      userVote?.voteType === 'disagree' 
                        ? 'bg-red-500 hover:bg-red-600 text-white border-red-500' 
                        : 'hover:bg-red-500/10 hover:border-red-500/50'
                    }`}
                  >
                    <motion.div
                      animate={voting && userVote?.voteType === 'disagree' ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </motion.div>
                    <span>Disagree</span>
                    <motion.span
                      key={votes.disagree || 0}
                      initial={{ scale: 1.3, y: -5 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 500, 
                        damping: 15,
                        duration: 0.4 
                      }}
                      className="font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full"
                    >
                      {votes.disagree || 0}
                    </motion.span>
                  </GlowButton>
                </motion.div>
              </div>

              {/* Interaction Buttons */}
              <div className="flex items-center justify-center">
                <InteractionButtons
                  targetType="prompt"
                  targetId={prompt._id}
                  initialLikeCount={votes.total || 0}
                  commentCount={comments.length}
                  onCommentClick={() => {
                    const commentInput = document.querySelector('textarea');
                    commentInput?.focus();
                  }}
                  size="lg"
                />
              </div>

              {/* Vote Results */}
              {votes.total > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Agree</span>
                    <motion.span
                      key={Math.round(((votes.agree || 0) / votes.total) * 100)}
                      initial={{ scale: 1.2, color: '#10b981' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      transition={{ duration: 0.3 }}
                    >
                      {Math.round(((votes.agree || 0) / votes.total) * 100)}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-card-secondary rounded-full h-3 overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${((votes.agree || 0) / votes.total) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Disagree</span>
                    <motion.span
                      key={Math.round(((votes.disagree || 0) / votes.total) * 100)}
                      initial={{ scale: 1.2, color: '#ef4444' }}
                      animate={{ scale: 1, color: 'inherit' }}
                      transition={{ duration: 0.3 }}
                    >
                      {Math.round(((votes.disagree || 0) / votes.total) * 100)}%
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="glass border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Discussion ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comment Input */}
              <div className="space-y-3">
                <Textarea
                  placeholder="Share your thoughts on today's prompt..."
                  className="min-h-[100px] bg-card-secondary border-primary/20 focus:border-primary focus:glow-subtle rounded-xl resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <GlowButton
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || submittingComment}
                    className="px-6"
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </GlowButton>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((comment: any, index: number) => (
                    <motion.div 
                      key={comment._id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CommentComponent 
                        comment={comment}
                        targetType="prompt"
                        targetId={prompt._id}
                        depth={0}
                        maxDepth={2}
                        onUpdate={fetchTodaysPrompt}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
