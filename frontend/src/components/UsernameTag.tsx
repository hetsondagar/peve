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
  isValid?: boolean;
}

export default function UsernameTag({ 
  username, 
  onRemove, 
  clickable = true, 
  variant = 'outline',
  className = '',
  showRemove = true,
  isInvalid = false,
  isValid = false
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
        variant={variant} 
        className={`flex items-center gap-1 ${clickable ? 'cursor-pointer hover:bg-primary/10' : ''} ${className}`}
        onClick={handleClick}
      >
        <User className="w-3 h-3" />
        @{username}
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
