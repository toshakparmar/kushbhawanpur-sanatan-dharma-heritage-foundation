import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-saffron-deep text-cream hover:bg-maroon hover:shadow-lg active:scale-[0.98] shadow-sm",
        secondary:
          "border border-maroon text-maroon hover:bg-maroon/10 active:scale-[0.98]",
        gold:
          "bg-gold text-maroon-deep hover:bg-gold-dark hover:text-cream shadow-sm active:scale-[0.98]",
        outline:
          "border border-border text-ink hover:bg-sand/60 hover:border-gold/60",
        ghost:
          "text-ink hover:bg-sand/60 hover:text-maroon",
        link: "text-maroon underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5 rounded-full",
        sm: "h-9 rounded-full px-3.5 text-xs",
        lg: "h-13 rounded-full px-7 text-base font-bold",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
