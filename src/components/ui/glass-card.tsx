import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "primary" | "purple" | "none";
  style?: CSSProperties;
}

export function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = "none",
  style 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        hover && "hover:scale-[1.02] hover:shadow-elevation",
        glow === "primary" && "glow-primary",
        glow === "purple" && "glow-purple",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}