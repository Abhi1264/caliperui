import { forwardRef } from "react";
import type { FieldsetHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface RadioOption {
  disabled?: boolean;
  label: ReactNode;
  value: string;
}

export interface RadioGroupProps extends Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "children"
> {
  defaultValue?: string;
  legend: ReactNode;
  name: string;
  options: readonly RadioOption[];
  value?: string;
}

export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ className, defaultValue, legend, name, options, value, ...props }, ref) => {
    const controlled = value !== undefined;

    return (
      <fieldset ref={ref} className={cn("m-0 min-w-0 border-0 p-0", className)} {...props}>
        <legend className="mb-1.5 px-0 text-xs font-medium text-muted">{legend}</legend>
        <div className="grid gap-2">
          {options.map((option) => (
            <label key={option.value} className="caliper-choice">
              <input
                className="caliper-radio"
                type="radio"
                name={name}
                value={option.value}
                disabled={option.disabled}
                {...(controlled
                  ? { checked: value === option.value }
                  : { defaultChecked: defaultValue === option.value })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    );
  },
);

RadioGroup.displayName = "RadioGroup";
