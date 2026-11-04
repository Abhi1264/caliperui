import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/cn";

export type ButtonVariant = "outline" | "ghost" | "solid" | "destructive";
export type ButtonSize = "sm" | "md" | "icon";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass";

const base = `inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[4px] border text-xs font-medium leading-none transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0 ${focus}`;

const variants: Record<ButtonVariant, string> = {
  outline: "border-line bg-surface text-ink hover:bg-raised",
  ghost: "border-transparent bg-transparent text-ink hover:bg-raised",
  solid: "border-ink bg-ink text-surface hover:bg-ink/90",
  destructive: "border-stamp/40 bg-stamp/10 text-stamp hover:bg-stamp/15",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-7 px-2.5 text-[11px]",
  md: "h-8 px-3",
  icon: "h-8 w-8 p-0",
};

export function buttonVariants({
  variant = "outline",
  size = "md",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
} = {}) {
  return cn(base, variants[variant], sizes[size]);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);

Button.displayName = "Button";
