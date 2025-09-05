import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  title: string;
  progress: number;
  max?: number;
  description?: string;
  icon?: LucideIcon;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  children?: ReactNode;
}

export function ProgressCard({
  title,
  progress,
  max = 100,
  description,
  icon: Icon,
  showPercentage = true,
  animated = true,
  className,
  children
}: ProgressCardProps) {
  const percentage = Math.min((progress / max) * 100, 100);

  const content = (
    <GlassCard className={cn("relative overflow-hidden", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              {description && (
                <p className="text-sm text-foreground-secondary">{description}</p>
              )}
            </div>
          </div>
          
          {showPercentage && (
            <div className="text-right">
              <div className="text-lg font-bold text-foreground">
                {Math.round(percentage)}%
              </div>
              <div className="text-xs text-foreground-secondary">
                {progress}/{max}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-foreground-secondary">Progress</span>
            <span className="text-foreground">{progress} / {max}</span>
          </div>
          
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-primary rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Additional Content */}
        {children && (
          <div className="pt-2">
            {children}
          </div>
        )}
      </div>
    </GlassCard>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
