import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CircleButtonProps extends Omit<ButtonProps, "size"> {
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 rounded-full p-0",
  md: "h-10 w-10 rounded-full p-0",
  lg: "h-12 w-12 rounded-full p-0",
};

export const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(sizeClasses[size], className)}
        {...props}
      />
    );
  }
);

CircleButton.displayName = "CircleButton";
