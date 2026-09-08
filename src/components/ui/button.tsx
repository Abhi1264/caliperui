import * as React from "react";

import { cn } from "../../lib/cn";

export type ButtonVariant = "outline" | "ghost" | "solid" | "destructive";
export type ButtonSize = "sm" | "md" | "icon";

const base =
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[4px] border text-xs font-medium leading-none outline-none transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] disabled:pointer-events-none disabled:opacity-40 [&_svg]:shrink-0";

const variants: Record<ButtonVariant, string> = {
  outline:
    "border-zinc-800 bg-[#121215] text-zinc-100 hover:border-zinc-700 hover:bg-[#18181b] active:bg-zinc-800",
  ghost:
    "border-transparent bg-transparent text-zinc-300 hover:bg-[#18181b] hover:text-zinc-50 active:bg-zinc-800",
  solid:
    "border-zinc-50 bg-zinc-50 text-zinc-950 hover:border-white hover:bg-white active:bg-zinc-200",
  destructive:
    "border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-300 active:bg-red-500/20",
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

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
