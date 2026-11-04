import { forwardRef, useId } from "react";
import type { TextareaHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, id, ...props }, ref) => {
    const generatedId = useId();

    return (
      <textarea
        ref={ref}
        id={id ?? generatedId}
        className={cn(
          "flex min-h-20 w-full resize-y rounded-sm border border-line bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-2 focus-visible:outline-focus focus-visible:focus-pair placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-stamp",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
