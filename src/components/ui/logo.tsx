import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl', 
    xl: 'text-2xl'
  };

  // Use image 1 for light mode, image 2 for dark mode
  const logoSrc = theme === 'dark' ? '/2.png' : '/1.png';

  return (
    <motion.div 
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.img 
        src={logoSrc}
        alt="Peve Logo" 
        className={`${sizeClasses[size]} rounded-full`}
        key={theme} // Force re-render when theme changes
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
      {showText && (
        <span className={`font-bold ${textSizes[size]} ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          peve
        </span>
      )}
    </motion.div>
  );
}
