import * as React from "react";

import { cn } from "../../lib/cn";

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn(
          "w-full caption-bottom border-collapse text-left text-xs text-zinc-300",
          className,
        )}
        {...props}
      />
    </div>
  ),
);

Table.displayName = "Table";

export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("[&_tr]:border-b [&_tr]:border-white/8", className)}
      {...props}
    />
  ),
);

TableHeader.displayName = "TableHeader";

export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);

TableBody.displayName = "TableBody";

export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b border-white/8 transition-colors hover:bg-white/2.5", className)}
      {...props}
    />
  ),
);

TableRow.displayName = "TableRow";

export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-8 whitespace-nowrap px-3 text-left align-middle font-mono text-[10px] font-medium uppercase tracking-widest text-zinc-400",
        className,
      )}
      {...props}
    />
  ),
);

TableHead.displayName = "TableHead";

export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn("h-9 whitespace-nowrap px-3 py-1.5 align-middle", className)}
      {...props}
    />
  ),
);

TableCell.displayName = "TableCell";

export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-3 text-left text-[11px] text-zinc-400", className)}
      {...props}
    />
  ),
);

TableCaption.displayName = "TableCaption";
