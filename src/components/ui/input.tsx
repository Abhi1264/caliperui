import * as React from "react";

import { cn } from "../../lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-9 w-full rounded-sm border border-white/8 bg-transparent px-3 py-2 font-mono text-sm text-zinc-100 outline-none transition-colors placeholder:font-mono placeholder:text-zinc-600 hover:border-white/[0.14] focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-red-500/50 aria-invalid:focus-visible:ring-red-500/30",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
