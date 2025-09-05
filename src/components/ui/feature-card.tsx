import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient?: "primary" | "secondary" | "accent" | "purple";
  hover?: boolean;
  animate?: boolean;
  className?: string;
  children?: ReactNode;
}

const iconGradients = {
  primary: "bg-gradient-primary",
  secondary: "bg-gradient-secondary",
  accent: "bg-gradient-accent",
  purple: "bg-gradient-purple"
};

export function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient = "primary",
  hover = true,
  animate = true,
  className,
  children
}: FeatureCardProps) {
  const content = (
    <GlassCard className={cn(
      "text-center transition-all duration-300",
      hover && "hover:scale-105 hover:shadow-elevation",
      className
    )}>
      <div className="space-y-4">
        {/* Icon */}
        <motion.div
          className={cn(
            "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center",
            iconGradients[gradient]
          )}
          whileHover={{ rotate: 5, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-8 h-8 text-foreground" />
        </motion.div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-foreground-secondary leading-relaxed">
            {description}
          </p>
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

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={hover ? { y: -5 } : {}}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
