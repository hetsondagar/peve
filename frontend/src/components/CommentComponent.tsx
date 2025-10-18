import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, MoreVertical, Edit2, Trash2, 
  Reply, Check, X, ChevronDown, ChevronUp 
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { requireAuth } from '@/utils/auth';
import Avatar from './Avatar';
import UsernameLink from './UsernameLink';
import UsernameWithAvatar from './UsernameWithAvatar';
import { GlowButton } from './ui/glow-button';
import { Textarea } from './ui/textarea';

interface CommentComponentProps {
  comment: any;
  currentUserId?: string;
  onUpdate?: () => void;
  onReply?: (parentComment: any) => void;
  depth?: number;
  maxDepth?: number;
  targetType?: string;
  targetId?: string;
}

export function CommentComponent({ 
  comment, 
  currentUserId, 
  onUpdate, 
  onReply,
  depth = 0,
  maxDepth = 3,
  targetType,
  targetId
}: CommentComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const isOwner = currentUserId && comment.author?._id === currentUserId;
  const canReply = depth < maxDepth;
  
  console.log('Comment data:', comment);
  console.log('Replies count:', comment.repliesCount);

  // Check if user has liked this comment
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await apiFetch('/api/interactions/status', {
          method: 'POST',
          body: JSON.stringify({
            items: [{
              targetType: 'comment',
              targetId: comment._id
            }]
          })
        });
        
        if (response.success && response.data.length > 0) {
          setIsLiked(response.data[0].isLiked);
        }
      } catch (error) {
        console.error('Failed to check like status:', error);
      }
    };

    checkLikeStatus();
  }, [comment._id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!requireAuth()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to like comments",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiFetch(`/api/interactions/like/comment/${comment._id}`, {
        method: 'POST'
      });
      
      if (response.success) {
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like comments",
          variant: "destructive",
        });
      } else {
        console.error('Failed to like comment:', error);
        toast({
          title: "Error",
          description: "Failed to like comment",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    try {
      setLoading(true);
      const response = await apiFetch(`/api/comments/${comment._id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: editContent.trim() })
      });
      
      if (response.success) {
        setIsEditing(false);
        onUpdate?.();
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      setLoading(true);
      const response = await apiFetch(`/api/comments/${comment._id}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        onUpdate?.();
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!replyContent.trim()) return;
    
    if (!requireAuth()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to post replies",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await apiFetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({
          content: replyContent.trim(),
          targetType: targetType || comment.targetType,
          targetId: targetId || comment.targetId,
          parentComment: comment._id
        })
      });
      
      if (response.success) {
        setReplyContent('');
        setIsReplying(false);
        onUpdate?.();
        toast({
          title: "Success",
          description: "Reply posted successfully",
        });
      }
    } catch (error) {
      if (error.message?.includes('Authentication failed')) {
        toast({
          title: "Authentication Required",
          description: "Please log in to post replies",
          variant: "destructive",
        });
      } else {
        console.error('Failed to post reply:', error);
        toast({
          title: "Error",
          description: "Failed to post reply",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async () => {
    try {
      console.log('Fetching replies for comment:', comment._id);
      const response = await apiFetch(`/api/comments/replies/${comment._id}`);
      console.log('Replies response:', response);
      if (response.success) {
        setReplies(response.data.replies || []);
        console.log('Set replies:', response.data.replies);
      }
    } catch (error) {
      console.error('Failed to fetch replies:', error);
    }
  };

  const toggleReplies = () => {
    if (!showReplies && replies.length === 0) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${depth > 0 ? 'ml-8 border-l-2 border-border pl-4' : ''}`}
    >
      <div className="p-4 rounded-lg bg-card-secondary border border-border hover:border-primary/20 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            {/* Comment Header */}
            <div className="flex items-center gap-2">
              <UsernameWithAvatar
                username={comment.author?.username || 'Anonymous'}
                userId={comment.author?._id}
                name={comment.author?.name}
                avatarStyle={comment.author?.avatarStyle || 'botttsNeutral'}
                avatarUrl={comment.author?.avatarUrl}
                size={24}
                variant="compact"
                className="font-semibold text-sm"
              />
              <span className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
                {comment.isEdited && (
                  <span className="ml-1 text-xs text-muted-foreground">(edited)</span>
                )}
              </span>
              
              {/* Menu Button */}
              {isOwner && (
                <div className="relative ml-auto" ref={menuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded hover:bg-primary/10 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg z-10"
                      >
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDelete();
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 text-red-400 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Comment Content */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="min-h-[80px] bg-card border-primary/20 focus:border-primary"
                    placeholder="Edit your comment..."
                  />
                  <div className="flex gap-2">
                    <GlowButton
                      onClick={handleEdit}
                      disabled={loading || !editContent.trim()}
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Save
                    </GlowButton>
                    <GlowButton
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(comment.content);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </GlowButton>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  {comment.content}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Comment Actions */}
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  isLiked 
                    ? 'text-red-500' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                </motion.div>
                <motion.span
                  key={likeCount}
                  initial={{ scale: 1.2, color: '#ef4444' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                >
                  {likeCount}
                </motion.span>
              </motion.button>

              {canReply && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Reply className="w-3 h-3" />
                  Reply
                </motion.button>
              )}

              {/* Show replies button */}
              {comment.repliesCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleReplies}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showReplies ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
                </motion.button>
              )}
            </div>

            {/* Reply Form */}
            <AnimatePresence>
              {isReplying && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 pt-2"
                >
                  <form onSubmit={handleReply} className="space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] bg-card border-primary/20 focus:border-primary"
                      placeholder="Write a reply..."
                    />
                    <div className="flex gap-2">
                      <GlowButton
                        type="submit"
                        disabled={loading || !replyContent.trim()}
                        size="sm"
                      >
                        {loading ? 'Posting...' : 'Post Reply'}
                      </GlowButton>
                      <GlowButton
                        type="button"
                        onClick={() => {
                          setIsReplying(false);
                          setReplyContent('');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </GlowButton>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Replies */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {replies.map((reply) => (
              <CommentComponent
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                onUpdate={onUpdate}
                depth={depth + 1}
                maxDepth={maxDepth}
                targetType={targetType}
                targetId={targetId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
