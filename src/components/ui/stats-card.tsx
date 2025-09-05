import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive: boolean;
  };
  glow?: "primary" | "secondary" | "accent" | "purple" | "none";
  className?: string;
  animate?: boolean;
}

const glowClasses = {
  primary: "glow-primary",
  secondary: "glow-secondary", 
  accent: "glow-accent",
  purple: "glow-purple",
  none: ""
};

const iconGradients = {
  primary: "bg-gradient-primary",
  secondary: "bg-gradient-secondary",
  accent: "bg-gradient-accent",
  purple: "bg-gradient-purple",
  none: "bg-muted/20"
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  glow = "none",
  className,
  animate = true
}: StatsCardProps) {
  const content = (
    <GlassCard className={cn(
      "relative overflow-hidden",
      glowClasses[glow],
      className
    )}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={cn(
            "p-3 rounded-lg",
            iconGradients[glow]
          )}>
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="text-2xl font-bold text-foreground mb-1">
            {value}
          </div>
          <div className="text-sm text-foreground-secondary">
            {title}
          </div>
          {description && (
            <div className="text-xs text-foreground-secondary mt-1">
              {description}
            </div>
          )}
        </div>
        
        {trend && (
          <div className="text-right">
            <div className={cn(
              "text-sm font-medium",
              trend.positive ? "text-green-400" : "text-red-400"
            )}>
              {trend.positive ? "+" : ""}{trend.value}%
            </div>
            <div className="text-xs text-foreground-secondary">
              {trend.label}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );

  if (animate) {
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
