import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, id, type, ...props }, ref) => {
    const generatedId = useId();

    return (
      <input
        ref={ref}
        id={id ?? generatedId}
        type={type}
        className={cn(
          "flex h-9 w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-focus focus-visible:focus-pair placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-stamp",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
