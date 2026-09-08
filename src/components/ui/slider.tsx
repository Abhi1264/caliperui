import * as React from "react";

import { cn } from "../../lib/cn";

export type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="range"
      className={cn("caliper-slider", className)}
      {...props}
    />
  ),
);

Slider.displayName = "Slider";
