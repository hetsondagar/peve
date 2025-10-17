import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

interface UsernameWithAvatarProps {
  username: string;
  userId?: string;
  name?: string;
  avatarStyle?: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
  showFullName?: boolean;
  showAvatar?: boolean;
  clickable?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export default function UsernameWithAvatar({ 
  username, 
  userId,
  name,
  avatarStyle = 'botttsNeutral',
  avatarUrl,
  size = 32,
  className = '',
  showFullName = false,
  showAvatar = true,
  clickable = true,
  variant = 'default'
}: UsernameWithAvatarProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (!clickable) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Always navigate to profile page instead of showing modal
    if (userId) {
      navigate(`/profile/${userId}`);
    } else if (username) {
      navigate(`/profile/${username}`);
    }
  };

  const displayName = showFullName && name ? name : username;
  const avatarSize = variant === 'compact' ? size * 0.8 : size;

  if (variant === 'compact') {
    return (
      <>
        <motion.div
          onClick={handleClick}
          className={`flex items-center gap-2 ${clickable ? 'cursor-pointer' : ''} ${className}`}
          whileHover={clickable ? { scale: 1.02 } : {}}
          whileTap={clickable ? { scale: 0.98 } : {}}
        >
          {showAvatar && (
            <Avatar 
              username={username}
              avatarStyle={avatarStyle}
              size={avatarSize}
            />
          )}
          <span className={`text-sm font-medium ${clickable ? 'text-primary hover:text-primary/80' : 'text-foreground'}`}>
            {displayName}
          </span>
        </motion.div>
      </>
    );
  }

  if (variant === 'detailed') {
    return (
      <>
        <motion.div
          onClick={handleClick}
          className={`flex items-center gap-3 ${clickable ? 'cursor-pointer' : ''} ${className}`}
          whileHover={clickable ? { scale: 1.02 } : {}}
          whileTap={clickable ? { scale: 0.98 } : {}}
        >
          {showAvatar && (
            <Avatar 
              username={username}
              avatarStyle={avatarStyle}
              size={avatarSize}
            />
          )}
          <div className="flex flex-col">
            <span className={`font-semibold ${clickable ? 'text-primary hover:text-primary/80' : 'text-foreground'}`}>
              {displayName}
            </span>
            {showFullName && name && name !== username && (
              <span className="text-xs text-muted-foreground">@{username}</span>
            )}
          </div>
        </motion.div>
      </>
    );
  }

  // Default variant
  return (
    <>
      <motion.div
        onClick={handleClick}
        className={`flex items-center gap-2 ${clickable ? 'cursor-pointer' : ''} ${className}`}
        whileHover={clickable ? { scale: 1.02 } : {}}
        whileTap={clickable ? { scale: 0.98 } : {}}
      >
        {showAvatar && (
          <Avatar 
            username={username}
            avatarStyle={avatarStyle}
            size={avatarSize}
          />
        )}
        <span className={`font-medium ${clickable ? 'text-primary hover:text-primary/80' : 'text-foreground'}`}>
          {displayName}
        </span>
      </motion.div>
    </>
  );
}
