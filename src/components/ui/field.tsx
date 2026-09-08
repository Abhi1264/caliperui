import * as React from "react";

import { cn } from "../../lib/cn";

export interface FieldProps {
  label: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[11px] leading-4 text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] leading-4 text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
