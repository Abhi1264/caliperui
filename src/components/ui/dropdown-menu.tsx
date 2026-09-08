"use client";

import * as React from "react";

import { cn } from "../../lib/cn";

import { Button, type ButtonProps } from "./button";

const itemClass =
  "flex h-8 w-full cursor-pointer items-center rounded-[3px] px-2.5 text-left font-mono text-xs text-zinc-300 outline-none hover:bg-[#18181b] hover:text-zinc-50 focus:bg-[#18181b] focus:text-zinc-50 disabled:pointer-events-none disabled:opacity-40 aria-current:bg-[#18181b] aria-current:text-zinc-50";

interface DropdownMenuContextValue {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext(componentName: string) {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    throw new Error(`${componentName} must be rendered inside DropdownMenu.`);
  }

  return context;
}

function assignRef<T>(ref: React.ForwardedRef<T>, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

function menuItems(menu: HTMLElement) {
  return Array.from(
    menu.querySelectorAll<HTMLButtonElement>(':scope > [role="menuitem"]:not(:disabled)'),
  );
}

function hideRootPopover(start: HTMLElement) {
  let root: HTMLElement | undefined;
  for (let el: HTMLElement | null = start; el; el = el.parentElement) {
    if (el.hasAttribute("popover")) root = el;
  }
  root?.hidePopover();
}

function placeMenu(menu: HTMLElement, trigger: HTMLElement, side: "bottom" | "end") {
  const rect = trigger.getBoundingClientRect();
  const gap = 4;

  if (side === "end") {
    const width = menu.offsetWidth;
    const right = rect.right + gap;
    const flip = right + width > window.innerWidth - 8;
    menu.style.minWidth = "";
    menu.style.left = `${flip ? Math.max(8, rect.left - width - gap) : right}px`;
    menu.style.top = `${Math.max(8, Math.min(rect.top, window.innerHeight - menu.offsetHeight - 8))}px`;
    return;
  }

  menu.style.minWidth = `${rect.width}px`;
  const below = rect.bottom + gap;
  const flip = below + menu.offsetHeight > window.innerHeight - 8;
  menu.style.top = `${flip ? Math.max(8, rect.top - menu.offsetHeight - gap) : below}px`;
  menu.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - menu.offsetWidth - 8))}px`;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const id = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenuContext.Provider value={{ id, open, setOpen, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

export const DropdownMenuSub = DropdownMenu;

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, size = "md", variant = "outline", ...props }, ref) => {
    const { id, open, triggerRef } = useDropdownMenuContext("DropdownMenuTrigger");

    return (
      <Button
        {...props}
        ref={(node) => {
          triggerRef.current = node;
          assignRef(ref, node);
        }}
        variant={variant}
        size={size}
        className={cn("justify-between!", className)}
        popoverTarget={id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          if (!open || event.defaultPrevented) return;
          if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
          const menu = document.getElementById(id);
          if (!menu) return;
          const items = menuItems(menu);
          if (items.length === 0) return;
          event.preventDefault();
          (event.key === "ArrowUp" ? items[items.length - 1] : items[0]).focus();
        }}
      >
        {children}
        <span
          aria-hidden="true"
          className={cn(
            "font-mono text-[10px] text-zinc-400 transition-transform duration-150",
            open && "rotate-45",
          )}
        >
          +
        </span>
      </Button>
    );
  },
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "bottom" | "end";
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, onKeyDown, onToggle, side = "bottom", ...props }, ref) => {
    const { id, setOpen, triggerRef } = useDropdownMenuContext("DropdownMenuContent");

    return (
      <div
        {...props}
        ref={ref}
        id={id}
        popover="auto"
        role="menu"
        className={cn(
          "m-0 max-h-64 min-w-44 overflow-y-auto rounded-sm border border-white/8 bg-[#121215] p-0.5 text-zinc-100 inset-auto",
          className,
        )}
        onToggle={(event) => {
          onToggle?.(event);
          const next = event.newState === "open";
          setOpen(next);
          if (!next) return;

          const menu = event.currentTarget;
          requestAnimationFrame(() => {
            if (triggerRef.current) placeMenu(menu, triggerRef.current, side);
            const selected = menu.querySelector<HTMLElement>(
              ':scope > [role="menuitem"][aria-current="true"]',
            );
            (selected ?? menuItems(menu)[0])?.focus();
          });
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) return;

          if (event.key === "ArrowRight") {
            const submenuId =
              event.target instanceof HTMLElement
                ? event.target.getAttribute("popovertarget")
                : null;
            if (!submenuId) return;
            event.preventDefault();
            document.getElementById(submenuId)?.showPopover();
            return;
          }

          if (event.key === "ArrowLeft" && triggerRef.current?.closest("[popover]")) {
            event.preventDefault();
            event.currentTarget.hidePopover();
            triggerRef.current.focus();
            return;
          }

          const items = menuItems(event.currentTarget);
          if (items.length === 0) return;

          const index = items.indexOf(event.target as HTMLButtonElement);
          const next =
            event.key === "ArrowDown"
              ? items[index === -1 ? 0 : (index + 1) % items.length]
              : event.key === "ArrowUp"
                ? items[index === -1 ? items.length - 1 : (index - 1 + items.length) % items.length]
                : event.key === "Home"
                  ? items[0]
                  : event.key === "End"
                    ? items[items.length - 1]
                    : null;

          if (!next) return;

          event.preventDefault();
          next.focus();
        }}
      />
    );
  },
);

DropdownMenuContent.displayName = "DropdownMenuContent";

export const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  Omit<DropdownMenuContentProps, "side">
>((props, ref) => <DropdownMenuContent {...props} ref={ref} side="end" />);

DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

export type DropdownMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, onClick, type = "button", ...props }, ref) => (
    <button
      {...props}
      ref={ref}
      type={type}
      role="menuitem"
      className={cn(itemClass, className)}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        hideRootPopover(event.currentTarget);
      }}
    />
  ),
);

DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSubTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ children, className, type = "button", ...props }, ref) => {
    const { id, open, triggerRef } = useDropdownMenuContext("DropdownMenuSubTrigger");

    return (
      <button
        {...props}
        ref={(node) => {
          triggerRef.current = node;
          assignRef(ref, node);
        }}
        type={type}
        role="menuitem"
        className={cn(itemClass, "justify-between", className)}
        popoverTarget={id}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
      >
        {children}
        <span aria-hidden="true" className="font-mono text-[10px] text-zinc-400">
          ›
        </span>
      </button>
    );
  },
);

DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

export const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.ComponentPropsWithoutRef<"hr">
>(({ className, ...props }, ref) => (
  <hr
    {...props}
    ref={ref}
    role="separator"
    className={cn("mx-1 my-0.5 border-0 border-t border-white/8", className)}
  />
));

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
