import { forwardRef, useId } from "react";
import type { ProgressHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type ProgressProps = ProgressHTMLAttributes<HTMLProgressElement>;

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(
  ({ className, id, ...props }, ref) => {
    const generatedId = useId();

    return (
      <progress
        ref={ref}
        id={id ?? generatedId}
        className={cn("caliper-progress", className)}
        {...props}
      />
    );
  },
);

Progress.displayName = "Progress";
