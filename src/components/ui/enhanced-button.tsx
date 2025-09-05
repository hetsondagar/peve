import { ReactNode, forwardRef } from "react";
import { motion, MotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "hero" | "glass" | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  disabled?: boolean;
  animate?: boolean;
  motionProps?: MotionProps;
  className?: string;
}

const motionVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    children, 
    variant = "default", 
    size = "default", 
    loading = false, 
    disabled = false,
    animate = true,
    motionProps,
    className,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    const buttonContent = (
      <>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </>
    );

    if (animate && !isDisabled) {
      return (
        <motion.div
          whileHover={motionVariants.hover}
          whileTap={motionVariants.tap}
          transition={{ duration: 0.2 }}
          {...motionProps}
        >
          <Button
            ref={ref}
            variant={variant}
            size={size}
            disabled={isDisabled}
            className={cn(className)}
            {...props}
          >
            {buttonContent}
          </Button>
        </motion.div>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={cn(className)}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
