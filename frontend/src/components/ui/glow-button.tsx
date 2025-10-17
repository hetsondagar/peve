import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glowButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(180_100%_46%/0.4)] hover:shadow-[0_0_30px_hsl(180_100%_46%/0.6)] hover:scale-105",
        outline:
          "border-2 border-primary text-primary bg-transparent hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(180_100%_46%/0.3)]",
        ghost:
          "text-primary hover:bg-primary/10 hover:text-primary",
        violet:
          "bg-secondary text-secondary-foreground shadow-[0_0_20px_hsl(270_100%_68%/0.4)] hover:shadow-[0_0_30px_hsl(270_100%_68%/0.6)] hover:scale-105",
        amber:
          "bg-accent text-accent-foreground shadow-[0_0_20px_hsl(45_100%_50%/0.4)] hover:shadow-[0_0_30px_hsl(45_100%_50%/0.6)] hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(glowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };
