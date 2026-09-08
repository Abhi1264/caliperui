import * as React from "react";

import { cn } from "../../lib/cn";

export type SliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, id, ...props }, ref) => {
    const generatedId = React.useId();

    return (
      <input
        ref={ref}
        id={id ?? generatedId}
        type="range"
        className={cn("caliper-slider", className)}
        {...props}
      />
    );
  },
);

Slider.displayName = "Slider";
