import { useState } from 'react';
import { motion } from 'framer-motion';
import UserProfileModal from './UserProfileModal';

interface UsernameLinkProps {
  username: string;
  userId: string;
  className?: string;
  showFullName?: boolean;
  fullName?: string;
}

export default function UsernameLink({ 
  username, 
  userId, 
  className = '', 
  showFullName = false,
  fullName 
}: UsernameLinkProps) {
  const [showProfile, setShowProfile] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfile(true);
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`text-primary hover:text-primary/80 transition-colors font-medium ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showFullName && fullName ? fullName : username}
      </motion.button>
      
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userId={userId}
      />
    </>
  );
}
