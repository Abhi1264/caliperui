"use client";

import * as React from "react";

import { cn } from "../../lib/cn";

import { buttonVariants } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
import { IconCommand, IconSearch } from "./icons";
import { Input } from "./input";
import { Kbd } from "./kbd";

export interface CommandItem {
  id: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  keywords?: readonly string[];
  label: string;
  onSelect?: () => void;
  shortcut?: string | readonly string[];
}

export interface CommandGroup {
  id: string;
  items: readonly CommandItem[];
  label?: string;
}

export interface CommandPaletteProps {
  className?: string;
  defaultOpen?: boolean;
  description?: string;
  emptyMessage?: React.ReactNode;
  enableHotkey?: boolean;
  groups: readonly CommandGroup[];
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  placeholder?: string;
  title?: string;
  trigger?: React.ReactNode | false;
  triggerAriaLabel?: string;
  triggerClassName?: string;
}

function toDomToken(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function matchesQuery(item: CommandItem, groupLabel: string | undefined, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return true;
  }

  const searchableText = [item.label, item.description, groupLabel, ...(item.keywords ?? [])]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  return tokens.every((token) => searchableText.includes(token));
}

export function CommandPalette({
  className,
  defaultOpen = false,
  description = "Search and select an action.",
  emptyMessage = "No commands found.",
  enableHotkey = true,
  groups,
  onOpenChange,
  open: controlledOpen,
  placeholder = "Type a command or search…",
  title = "Command menu",
  trigger,
  triggerAriaLabel = "Open command menu",
  triggerClassName,
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [query, setQuery] = React.useState("");
  const [requestedActiveId, setRequestedActiveId] = React.useState<string | null>(null);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : uncontrolledOpen;
  const openRef = React.useRef(open);
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>());
  const generatedId = React.useId();
  const listboxId = `${generatedId}-listbox`;

  openRef.current = open;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (openRef.current === nextOpen) {
        return;
      }

      openRef.current = nextOpen;

      if (!isOpenControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!enableHotkey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK =
        event.key.toLowerCase() === "k" &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey;

      if (!isCommandK || event.defaultPrevented || event.repeat || event.isComposing) {
        return;
      }

      const target = event.target;

      if (target instanceof HTMLElement && target.isContentEditable) {
        return;
      }

      event.preventDefault();
      setOpen(!openRef.current);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableHotkey, setOpen]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setRequestedActiveId(null);
    }
  }, [open]);

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matchesQuery(item, group.label, query)),
    }))
    .filter((group) => group.items.length > 0);

  const enabledItems = filteredGroups.flatMap((group) =>
    group.items.filter((item) => !item.disabled),
  );

  const activeItem =
    enabledItems.find((item) => item.id === requestedActiveId) ?? enabledItems[0] ?? null;
  const activeId = activeItem?.id ?? null;
  const activeOptionId = activeId ? `${listboxId}-option-${toDomToken(activeId)}` : undefined;

  React.useEffect(() => {
    if (open && activeId) {
      itemRefs.current.get(activeId)?.scrollIntoView({ block: "nearest" });
    }
  }, [activeId, open]);

  const moveSelection = React.useCallback(
    (direction: 1 | -1) => {
      if (enabledItems.length === 0) {
        return;
      }

      const currentIndex = enabledItems.findIndex((item) => item.id === activeId);
      const startIndex = currentIndex === -1 ? (direction === 1 ? -1 : 0) : currentIndex;
      const nextIndex = (startIndex + direction + enabledItems.length) % enabledItems.length;

      setRequestedActiveId(enabledItems[nextIndex]?.id ?? null);
    },
    [activeId, enabledItems],
  );

  const selectItem = React.useCallback(
    (item: CommandItem) => {
      if (item.disabled) {
        return;
      }

      setOpen(false);
      item.onSelect?.();
    },
    [setOpen],
  );

  const triggerContent =
    trigger === undefined ? (
      <>
        <IconCommand aria-hidden="true" />
        <span>Command menu</span>
        <Kbd className="ml-auto">⌘ K</Kbd>
      </>
    ) : (
      trigger
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger !== false ? (
        <DialogTrigger
          aria-label={triggerAriaLabel}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "justify-between!",
            triggerClassName,
          )}
        >
          {triggerContent}
        </DialogTrigger>
      ) : null}

      <DialogContent className={cn("overflow-hidden", className)} showCloseButton={false}>
        <div className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </div>

        <div className="flex h-12 items-center gap-2.5 border-b border-line px-3">
          <IconSearch aria-hidden="true" className="shrink-0 text-muted" />
          <Input
            id={`${generatedId}-query`}
            name="command-query"
            role="combobox"
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={open}
            aria-label={placeholder}
            autoComplete="off"
            className="h-full flex-1 rounded-none border-0 bg-transparent px-0 text-sm"
            placeholder={placeholder}
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setRequestedActiveId(null);
            }}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) {
                return;
              }

              if (event.key === "ArrowDown") {
                event.preventDefault();
                moveSelection(1);
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                moveSelection(-1);
              } else if (event.key === "Enter" && activeItem) {
                event.preventDefault();
                selectItem(activeItem);
              } else if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false);
              }
            }}
          />
          <Kbd className="shrink-0">ESC</Kbd>
        </div>

        <div
          id={listboxId}
          role="listbox"
          aria-label={`${title} results`}
          className="max-h-[min(22rem,60dvh)] overflow-y-auto p-1.5"
        >
          {filteredGroups.length === 0 ? (
            <div role="status" className="px-3 py-10 text-center text-sm text-muted">
              {emptyMessage}
            </div>
          ) : (
            filteredGroups.map((group, groupIndex) => {
              const groupLabelId = `${listboxId}-group-${toDomToken(group.id)}`;

              return (
                <React.Fragment key={group.id}>
                  {groupIndex > 0 ? (
                    <div
                      role="separator"
                      aria-orientation="horizontal"
                      className="my-1.5 h-px bg-line"
                    />
                  ) : null}
                  <div role="group" aria-labelledby={group.label ? groupLabelId : undefined}>
                    {group.label ? (
                      <div id={groupLabelId} className="px-2 py-1.5 text-xs text-muted">
                        {group.label}
                      </div>
                    ) : null}
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = item.id === activeId;
                        const optionId = `${listboxId}-option-${toDomToken(item.id)}`;
                        const shortcuts =
                          typeof item.shortcut === "string" ? [item.shortcut] : item.shortcut;

                        return (
                          <div
                            key={item.id}
                            ref={(node) => {
                              if (node) {
                                itemRefs.current.set(item.id, node);
                              } else {
                                itemRefs.current.delete(item.id);
                              }
                            }}
                            id={optionId}
                            role="option"
                            aria-disabled={item.disabled || undefined}
                            aria-selected={isActive}
                            className={cn(
                              "flex min-h-9 select-none items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm text-ink",
                              isActive && !item.disabled && "bg-raised",
                              item.disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer",
                            )}
                            onClick={() => selectItem(item)}
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseMove={() => {
                              if (!item.disabled) {
                                setRequestedActiveId(item.id);
                              }
                            }}
                          >
                            {item.icon ? (
                              <span aria-hidden="true" className="shrink-0 text-muted">
                                {item.icon}
                              </span>
                            ) : null}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{item.label}</span>
                              {item.description ? (
                                <span className="mt-0.5 block truncate text-[11px] text-muted">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                            {shortcuts?.length ? (
                              <span className="ml-auto flex shrink-0 gap-1">
                                {shortcuts.map((shortcut, shortcutIndex) => (
                                  <Kbd key={`${shortcut}-${shortcutIndex}`}>{shortcut}</Kbd>
                                ))}
                              </span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
