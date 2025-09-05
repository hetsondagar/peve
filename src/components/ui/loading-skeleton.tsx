import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "card";
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function LoadingSkeleton({
  className,
  variant = "rectangular",
  width,
  height,
  animate = true
}: LoadingSkeletonProps) {
  const baseClasses = "bg-muted/30 rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    rectangular: "w-full",
    circular: "rounded-full aspect-square",
    card: "w-full h-32"
  };

  const skeletonContent = (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height
      }}
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden"
      >
        {skeletonContent}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  return skeletonContent;
}

// Compound components for common skeleton patterns
export function SkeletonCard() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-4">
        <LoadingSkeleton variant="circular" width={48} height={48} />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" width="40%" />
        </div>
      </div>
      <LoadingSkeleton variant="rectangular" height={100} />
      <div className="flex gap-2">
        <LoadingSkeleton variant="rectangular" width={80} height={32} />
        <LoadingSkeleton variant="rectangular" width={80} height={32} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <div className="space-y-2 flex-1">
            <LoadingSkeleton variant="text" width="70%" />
            <LoadingSkeleton variant="text" width="50%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={index} variant="card" />
      ))}
    </div>
  );
}
