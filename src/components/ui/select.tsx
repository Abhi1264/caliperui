import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, id, ...props }, ref) => {
    const generatedId = useId();

    return (
      <select
        ref={ref}
        id={id ?? generatedId}
        className={cn(
          "h-9 w-full rounded-sm border border-line bg-surface px-3 text-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:cursor-not-allowed disabled:opacity-40",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
