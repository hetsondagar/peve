import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useInteractions } from '@/hooks/useInteractions';
import { GlowButton } from '@/components/ui/glow-button';

interface InteractionButtonsProps {
  targetType: 'project' | 'idea' | 'comment' | 'prompt';
  targetId: string;
  initialLikeCount?: number;
  commentCount?: number;
  onCommentClick?: () => void;
  showCommentButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InteractionButtons({
  targetType,
  targetId,
  initialLikeCount = 0,
  commentCount = 0,
  onCommentClick,
  showCommentButton = true,
  size = 'md',
  className = ''
}: InteractionButtonsProps) {
  const { isLiked, isSaved, likeCount, saveCount, isLoading, toggleLike, toggleSave, share } = useInteractions({
    targetType,
    targetId,
    initialLikeCount
  });

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleLike}
        disabled={isLoading}
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-200 ${
          isLiked 
            ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
            : 'bg-card-secondary hover:bg-primary/10 text-muted-foreground hover:text-foreground border border-border'
        }`}
      >
        <motion.div
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart className={`${iconSizes[size]} ${isLiked ? 'fill-current' : ''}`} />
        </motion.div>
        {likeCount > 0 && (
          <motion.span 
            className="ml-1 text-xs font-medium"
            animate={isLiked ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {likeCount}
          </motion.span>
        )}
      </motion.button>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSave}
        disabled={isLoading}
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-200 ${
          isSaved 
            ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' 
            : 'bg-card-secondary hover:bg-primary/10 text-muted-foreground hover:text-foreground border border-border'
        }`}
      >
        <motion.div
          animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Bookmark className={`${iconSizes[size]} ${isSaved ? 'fill-current' : ''}`} />
        </motion.div>
        {saveCount > 0 && (
          <motion.span 
            className="ml-1 text-xs font-medium"
            animate={isSaved ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {saveCount}
          </motion.span>
        )}
      </motion.button>

      {/* Comment Button */}
      {showCommentButton && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCommentClick}
          className={`${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-200 bg-card-secondary hover:bg-primary/10 text-muted-foreground hover:text-foreground border border-border`}
        >
          <MessageCircle className={iconSizes[size]} />
          {commentCount > 0 && (
            <span className="ml-1 text-xs font-medium">{commentCount}</span>
          )}
        </motion.button>
      )}

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={share}
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center transition-all duration-200 bg-card-secondary hover:bg-primary/10 text-muted-foreground hover:text-foreground border border-border`}
      >
        <Share2 className={iconSizes[size]} />
      </motion.button>
    </div>
  );
}
