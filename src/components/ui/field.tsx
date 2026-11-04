import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[11px] leading-4 text-stamp">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] leading-4 text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
