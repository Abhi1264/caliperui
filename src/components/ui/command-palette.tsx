"use client";

import * as React from "react";

import { cn } from "../../lib/cn";

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
        <Kbd className="ml-auto border-white/8 bg-black/20 text-zinc-500">⌘ K</Kbd>
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
            "inline-flex h-8 min-w-48 cursor-pointer items-center gap-2 rounded-sm border border-white/8 bg-[#121215] px-2.5 text-xs text-zinc-400 outline-none transition-colors hover:border-white/[0.14] hover:bg-[#18181b] hover:text-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
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

        <div className="flex h-12 items-center gap-2.5 border-b border-white/8 px-3">
          <IconSearch aria-hidden="true" className="shrink-0 text-zinc-500" />
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
            className="h-full flex-1 rounded-none border-0 px-0 text-sm focus-visible:border-transparent focus-visible:ring-0"
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
          <Kbd className="shrink-0 border-white/8 bg-black/20 text-zinc-600">ESC</Kbd>
        </div>

        <div
          id={listboxId}
          role="listbox"
          aria-label={`${title} results`}
          className="max-h-[min(22rem,60dvh)] overflow-y-auto p-1.5"
        >
          {filteredGroups.length === 0 ? (
            <div role="status" className="px-3 py-10 text-center font-mono text-xs text-zinc-400">
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
                      className="my-1.5 h-px bg-white/8"
                    />
                  ) : null}
                  <div role="group" aria-labelledby={group.label ? groupLabelId : undefined}>
                    {group.label ? (
                      <div
                        id={groupLabelId}
                        className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
                      >
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
                              "flex min-h-9 select-none items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-xs text-zinc-300 outline-none",
                              isActive && !item.disabled && "bg-[#18181b] text-zinc-50",
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
                              <span aria-hidden="true" className="shrink-0 text-zinc-500">
                                {item.icon}
                              </span>
                            ) : null}
                            <span className="min-w-0 flex-1">
                              <span className="block truncate">{item.label}</span>
                              {item.description ? (
                                <span className="mt-0.5 block truncate text-[11px] text-zinc-400">
                                  {item.description}
                                </span>
                              ) : null}
                            </span>
                            {shortcuts?.length ? (
                              <span className="ml-auto flex shrink-0 gap-1">
                                {shortcuts.map((shortcut, shortcutIndex) => (
                                  <Kbd
                                    key={`${shortcut}-${shortcutIndex}`}
                                    className="border-white/8 bg-black/20 text-zinc-600"
                                  >
                                    {shortcut}
                                  </Kbd>
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
