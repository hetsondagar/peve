import { motion } from 'framer-motion';
import { Heart, MessageCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { InteractionButtons } from '@/components/InteractionButtons';
import Avatar from './Avatar';
import UsernameWithAvatar from './UsernameWithAvatar';

interface ProjectCardProps {
  id?: string;
  title: string;
  description: string;
  tags?: string[];
  techStack?: string[];
  author?: {
    _id: string;
    username?: string;
    name?: string;
    avatarUrl?: string;
  };
  likes: number;
  comments: number;
  teamSize?: number;
  views?: number;
  coverImage?: string;
  image?: string;
  className?: string;
  onLike?: (projectId: string) => void;
  onComment?: (project: any) => void;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const ProjectCard = ({
  id,
  title,
  description,
  tags,
  techStack,
  author,
  likes,
  comments,
  teamSize,
  views,
  coverImage,
  image,
  className,
  onLike,
  onComment,
  isLiked = false,
  isSaved = false,
}: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClick = () => {
    if (id) {
      navigate(`/projects/${id}`);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    try {
      const response = await apiFetch(`/api/likes/project/${id}`, {
        method: 'POST'
      });

      if (response.success && onLike) {
        onLike(id);
        toast({
          title: response.data.action === 'liked' ? 'Liked!' : 'Unliked',
          description: response.data.action === 'liked' 
            ? 'You liked this project' 
            : 'You unliked this project',
        });
      }
    } catch (error) {
      console.error('Error liking project:', error);
      toast({
        title: "Error",
        description: "Failed to like project",
        variant: "destructive",
      });
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onComment && id) {
      onComment({ id, title, description, author });
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={handleClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border hover-glow cursor-pointer transition-all duration-300",
        className
      )}
    >
      {/* Image/Thumbnail */}
      {(coverImage || image) ? (
        <div className="h-48 overflow-hidden">
          <img
            src={coverImage || image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-primary opacity-20" />
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Author */}
        {author && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>by</span>
            <UsernameWithAvatar
              username={author.username || author.name || 'Unknown'}
              userId={author._id}
              name={author.name}
              avatarUrl={author.avatarUrl}
              size={20}
              variant="compact"
              className="font-medium"
            />
          </div>
        )}
        
        <h3 className="text-xl font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Tags/Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {(techStack || tags || []).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-4">
            {teamSize && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{teamSize}</span>
              </div>
            )}
            {views && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-sm">{views} views</span>
              </div>
            )}
          </div>
          
          {id && (
            <div onClick={(e) => e.stopPropagation()}>
              <InteractionButtons
                targetType="project"
                targetId={id}
                initialLikeCount={likes}
                commentCount={comments}
                onCommentClick={() => {
                  if (onComment) {
                    onComment({ id, title, description, author });
                  }
                }}
                size="sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      </div>
    </motion.div>
  );
};
