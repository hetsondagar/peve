import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UsernameTagProps {
  username: string;
  onRemove?: () => void;
  clickable?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  showRemove?: boolean;
  isInvalid?: boolean;
}

export default function UsernameTag({ 
  username, 
  onRemove, 
  clickable = true, 
  variant = 'outline',
  className = '',
  showRemove = true,
  isInvalid = false
}: UsernameTagProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (clickable) {
      navigate(`/profile/${username}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
    >
      <Badge 
        variant={isInvalid ? 'destructive' : variant} 
        className={`flex items-center gap-1 ${clickable ? 'cursor-pointer hover:bg-primary/10' : ''} ${className} ${isInvalid ? 'bg-red-500 text-white' : ''}`}
        onClick={handleClick}
      >
        <User className="w-3 h-3" />
        @{username}
        {isInvalid && <span className="ml-1 text-xs">(invalid)</span>}
        {onRemove && showRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-1 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </Badge>
    </motion.div>
  );
}
