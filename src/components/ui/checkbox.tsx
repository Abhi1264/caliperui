import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, label, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const input = (
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className={cn("caliper-check", label == null && className)}
        {...props}
      />
    );

    if (label == null) return input;

    return (
      <label htmlFor={inputId} className={cn("caliper-choice", className)}>
        {input}
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
