import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon, X } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  icon?: LucideIcon;
  timestamp?: string;
  unread?: boolean;
  priority?: "low" | "medium" | "high";
  onDismiss?: (id: string) => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
  children?: ReactNode;
}

const typeStyles = {
  info: {
    border: "border-blue-500/30",
    icon: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  success: {
    border: "border-green-500/30",
    icon: "text-green-400",
    bg: "bg-green-500/10"
  },
  warning: {
    border: "border-yellow-500/30",
    icon: "text-yellow-400",
    bg: "bg-yellow-500/10"
  },
  error: {
    border: "border-red-500/30",
    icon: "text-red-400",
    bg: "bg-red-500/10"
  }
};

const priorityStyles = {
  low: "border-l-4 border-l-green-500",
  medium: "border-l-4 border-l-yellow-500",
  high: "border-l-4 border-l-red-500"
};

export function NotificationCard({
  id,
  title,
  message,
  type = "info",
  icon: Icon,
  timestamp,
  unread = false,
  priority = "medium",
  onDismiss,
  onAction,
  actionLabel = "View",
  className,
  children
}: NotificationCardProps) {
  const typeStyle = typeStyles[type];
  const priorityStyle = priorityStyles[priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <GlassCard className={cn(
        "relative overflow-hidden transition-all duration-300",
        unread && "ring-2 ring-primary/20",
        priorityStyle,
        typeStyle.border,
        className
      )}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          {Icon && (
            <motion.div
              className={cn(
                "p-2 rounded-lg flex-shrink-0",
                typeStyle.bg
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Icon className={cn("w-5 h-5", typeStyle.icon)} />
            </motion.div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  {title}
                </h4>
                <p className="text-sm text-foreground-secondary mb-2">
                  {message}
                </p>
                
                {timestamp && (
                  <p className="text-xs text-foreground-secondary">
                    {timestamp}
                  </p>
                )}
              </div>

              {/* Unread indicator */}
              {unread && (
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3">
              {onAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAction}
                >
                  {actionLabel}
                </Button>
              )}
              
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDismiss(id)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Additional Content */}
            {children && (
              <div className="mt-3 pt-3 border-t border-border/20">
                {children}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
