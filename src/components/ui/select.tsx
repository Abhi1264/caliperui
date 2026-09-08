"use client";

import * as React from "react";

import { cn } from "../../lib/cn";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">;

function optionsFromChildren(children: React.ReactNode) {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ value?: string | number; children?: React.ReactNode }>(child)) {
      return [];
    }

    const label =
      typeof child.props.children === "string" || typeof child.props.children === "number"
        ? String(child.props.children)
        : String(child.props.value ?? "");
    const value = child.props.value != null ? String(child.props.value) : label;
    return [{ value, label }];
  });
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, id, defaultValue, value, onChange, disabled, name, ...props }, ref) => {
    const generatedId = React.useId();
    const triggerId = id ?? generatedId;
    const options = optionsFromChildren(children);
    const [uncontrolled, setUncontrolled] = React.useState(() =>
      String(defaultValue ?? options[0]?.value ?? ""),
    );
    const selected = value !== undefined ? String(value) : uncontrolled;
    const label = options.find((option) => option.value === selected)?.label ?? selected;

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
      if (value === undefined) setUncontrolled(event.target.value);
      onChange?.(event);
    }

    function pick(next: string) {
      if (value === undefined) setUncontrolled(next);
      onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>);
    }

    return (
      <div className="grid">
        <select
          ref={ref}
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          name={name}
          disabled={disabled}
          {...props}
          value={selected}
          onChange={handleChange}
        >
          {children}
        </select>
        <DropdownMenu>
          <DropdownMenuTrigger
            id={triggerId}
            className={cn("w-full", className)}
            disabled={disabled}
          >
            {label}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                aria-current={option.value === selected ? "true" : undefined}
                onClick={() => pick(option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  },
);

Select.displayName = "Select";
