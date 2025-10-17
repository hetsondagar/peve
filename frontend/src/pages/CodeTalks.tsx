import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, User, Heart, MessageCircle, Share2, 
  ThumbsUp, ThumbsDown, Zap, TrendingUp, Users, Clock
} from 'lucide-react';
import { NetworkBackground } from '@/components/NetworkBackground';
import { ThemeToggle } from '@/components/ThemeToggle';
import UsernameLink from '@/components/UsernameLink';
import Avatar from '@/components/Avatar';
import { GlowButton } from '@/components/ui/glow-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InteractionButtons } from '@/components/InteractionButtons';
import { apiFetch } from '@/lib/api';
import SearchBar from '@/components/SearchBar';

export default function CodeTalks() {
  const [prompt, setPrompt] = useState<any>(null);
  const [votes, setVotes] = useState<any>({});
  const [userVote, setUserVote] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [voting, setVoting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTodaysPrompt();
  }, []);

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

  const fetchTodaysPrompt = async () => {
    try {
      setLoading(true);
      const response = await apiFetch('/api/prompts/today');
      if (response.success) {
        setPrompt(response.data.prompt);
        setVotes(response.data.votes);
        setUserVote(response.data.userVote);
        setComments(response.data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch today\'s prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: string) => {
    if (!prompt || voting) return;
    
    try {
      setVoting(true);
      const response = await apiFetch(`/api/prompts/${prompt._id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteType })
      });
      
      if (response.success) {
        setUserVote(response.data.vote);
        setVotes(response.data.votes);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !prompt || submittingComment) return;
    
    try {
      setSubmittingComment(true);
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
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
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
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Peve</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <a href="/codetalks" className="text-primary font-semibold">CodeTalks</a>
                <a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
                <a href="/ideas" className="text-muted-foreground hover:text-foreground transition-colors">Ideas</a>
                <a href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">Leaderboard</a>
                <a href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">Profile</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SearchBar className="w-64" />
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
                    <button onClick={() => { window.location.href = '/profile'; setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Profile</button>
                    <button onClick={() => { window.location.href = '/codetalks'; setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">CodeTalks</button>
                    <button onClick={() => { localStorage.removeItem('peve_token'); window.location.href = '/login'; setShowProfileDropdown(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10">Log out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
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
                <GlowButton
                  variant={userVote?.voteType === 'agree' ? 'default' : 'outline'}
                  onClick={() => handleVote('agree')}
                  disabled={voting}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Agree ({votes.agree || 0})
                </GlowButton>
                
                <GlowButton
                  variant={userVote?.voteType === 'disagree' ? 'default' : 'outline'}
                  onClick={() => handleVote('disagree')}
                  disabled={voting}
                  className="flex items-center gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Disagree ({votes.disagree || 0})
                </GlowButton>
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Agree</span>
                    <span>{Math.round(((votes.agree || 0) / votes.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-card-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((votes.agree || 0) / votes.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Disagree</span>
                    <span>{Math.round(((votes.disagree || 0) / votes.total) * 100)}%</span>
                  </div>
                </div>
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
                  comments.map((comment: any) => (
                    <div key={comment._id} className="p-4 rounded-lg bg-card-secondary border border-border">
                      <div className="flex items-start gap-3">
                        <Avatar 
                          username={comment.author?.username || 'user'} 
                          avatarStyle={comment.author?.avatarStyle || 'botttsNeutral'} 
                          size={32} 
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">
                              {comment.author?._id ? (
                                <UsernameLink
                                  username={comment.author.username || 'Anonymous'}
                                  userId={comment.author._id}
                                  className="text-sm"
                                />
                              ) : (
                                comment.author?.username || 'Anonymous'
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <Heart className="w-3 h-3" />
                              Like
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <MessageCircle className="w-3 h-3" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
