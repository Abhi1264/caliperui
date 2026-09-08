import * as React from "react";

import { cn } from "../../lib/cn";

export interface GaugeProps
  extends Omit<React.MeterHTMLAttributes<HTMLMeterElement>, "children"> {
  label?: React.ReactNode;
  unit?: string;
}

export const Gauge = React.forwardRef<HTMLMeterElement, GaugeProps>(
  (
    {
      className,
      id,
      label,
      unit,
      min = 0,
      max = 100,
      value = 0,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const meterId = id ?? generatedId;
    const suffix = unit ? ` ${unit}` : "";
    const readout = `${value}${suffix}`;

    return (
      <div className={cn("grid gap-1.5", className)}>
        <div className="flex items-baseline justify-between gap-3">
          {label ? (
            <label
              htmlFor={meterId}
              className="font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400"
            >
              {label}
            </label>
          ) : null}
          <span className="font-mono text-xs tabular-nums text-zinc-100">
            {readout}
          </span>
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
        <div className="flex justify-between font-mono text-[10px] text-zinc-400">
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
