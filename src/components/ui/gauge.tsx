import { forwardRef, useId } from "react";
import type { MeterHTMLAttributes, ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface GaugeProps extends Omit<MeterHTMLAttributes<HTMLMeterElement>, "children"> {
  label?: ReactNode;
  unit?: string;
}

export const Gauge = forwardRef<HTMLMeterElement, GaugeProps>(
  ({ className, id, label, unit, min = 0, max = 100, value = 0, ...props }, ref) => {
    const generatedId = useId();
    const meterId = id ?? generatedId;
    const suffix = unit ? ` ${unit}` : "";
    const readout = `${value}${suffix}`;

    return (
      <div className={cn("grid gap-1.5", className)}>
        <div className="flex items-baseline justify-between gap-3">
          {label ? (
            <label htmlFor={meterId} className="text-xs font-medium text-muted">
              {label}
            </label>
          ) : null}
          <span className="font-mono text-xs tabular-nums text-ink">{readout}</span>
        </div>
        <meter
          ref={ref}
          id={meterId}
          min={min}
          max={max}
          value={value}
          className="caliper-meter h-2 w-full"
          {...props}
        />
        <div className="flex justify-between font-mono text-[10px] tabular-nums text-muted">
          <span>
            {min}
            {suffix}
          </span>
          <span>
            {max}
            {suffix}
          </span>
        </div>
      </div>
    );
  },
);

Gauge.displayName = "Gauge";
