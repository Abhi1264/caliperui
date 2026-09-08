"use client";

import { useEffect, useState, type ReactNode } from "react";

import {
  buttonVariants,
  CommandPalette,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconCheck,
  IconCommand,
  IconCopy,
  IconSearch,
  Kbd,
} from "@/components";
import { useClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/cn";

import { COMPONENTS } from "./showcase-data";
import styles from "./page.module.css";

function previewIdFromHash() {
  const id = location.hash.startsWith("#preview-") ? location.hash.slice("#preview-".length) : "";
  return COMPONENTS.some((row) => row.id === id) ? id : "button";
}

function applyPreview(id: string, writeUrl = true) {
  const root = document.getElementById("preview");
  if (!root) return;

  root.dataset.preview = id;
  const hash = `#preview-${id}`;

  for (const panel of root.querySelectorAll("[data-preview-panel]")) {
    panel.toggleAttribute("data-active", panel.id === `preview-${id}`);
  }
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#preview-"]')) {
    if (link.hash === hash) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }

  if (writeUrl) {
    const next = `#preview-${id}`;
    if (location.hash !== next) {
      history.replaceState(null, "", next);
    }
  }

  window.dispatchEvent(new Event("previewchange"));
}

export function setPreview(id: string, scroll = false) {
  applyPreview(id);
  if (scroll) document.getElementById("preview")?.scrollIntoView();
}

export function SiteDialog({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyPreview(previewIdFromHash(), location.hash.startsWith("#preview-"));

    function onHash() {
      if (location.hash.startsWith("#preview-")) applyPreview(previewIdFromHash(), false);
    }

    function onPreviewClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.('a[href^="#preview-"]');
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = link.hash.slice("#preview-".length);
      if (!COMPONENTS.some((row) => row.id === id)) return;
      event.preventDefault();
      setPreview(id, true);
    }

    window.addEventListener("hashchange", onHash);
    document.addEventListener("click", onPreviewClick);
    return () => {
      window.removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onPreviewClick);
    };
  }, []);

  return (
    <Dialog>
      {children}
      <DialogTrigger data-open-dialog tabIndex={-1} className="sr-only">
        Open dialog demo
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogTitle className={styles.dialogTitle}>Dialog demo</DialogTitle>
        <DialogDescription className={styles.dialogDescription}>
          This example uses the browser’s native dialog element. Press Escape, click the backdrop,
          or choose Close.
        </DialogDescription>
        <div className={styles.dialogActions}>
          <DialogClose className={buttonVariants({ variant: "solid" })}>Close dialog</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SiteCommandMenu() {
  return (
    <CommandPalette
      groups={[
        {
          id: "primitives",
          label: "Components",
          items: COMPONENTS.map((row) => ({
            id: `preview-${row.id}`,
            label: row.name,
            keywords: [row.id, row.source],
            icon: <IconCommand />,
            onSelect: () => setPreview(row.id, true),
          })),
        },
        {
          id: "navigation",
          label: "Go to",
          items: [
            {
              id: "components",
              label: "Go to components",
              icon: <IconCommand />,
              onSelect: () => {
                location.hash = "components";
              },
            },
            {
              id: "features",
              label: "Go to implementation",
              icon: <IconSearch />,
              onSelect: () => {
                location.hash = "features";
              },
            },
          ],
        },
        {
          id: "actions",
          label: "Actions",
          items: [
            {
              id: "dialog",
              label: "Open dialog demo",
              icon: <IconCommand />,
              shortcut: "Esc",
              onSelect: openDemoDialog,
            },
          ],
        },
      ]}
      title="Command menu"
      description="Search components, sections, and actions."
      placeholder="Search components…"
      emptyMessage="No matching commands."
      triggerAriaLabel="Command menu ⌘K"
      trigger={
        <>
          <span className={styles.searchLabel}>
            <IconSearch />
            <span>Command menu</span>
          </span>
          <Kbd>⌘K</Kbd>
        </>
      }
      triggerClassName={cn(buttonVariants({ variant: "outline", size: "sm" }), styles.searchButton)}
    />
  );
}

export function PreviewPicker() {
  const [current, setCurrent] = useState("button");

  useEffect(() => {
    const sync = () =>
      setCurrent(document.getElementById("preview")?.dataset.preview ?? previewIdFromHash());
    window.addEventListener("previewchange", sync);
    return () => window.removeEventListener("previewchange", sync);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full">
        {COMPONENTS.find((row) => row.id === current)?.name ?? "Button"}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {COMPONENTS.map((row) => (
          <DropdownMenuItem
            key={row.id}
            aria-current={current === row.id ? "true" : undefined}
            onClick={() => {
              setPreview(row.id);
              setCurrent(row.id);
            }}
          >
            {row.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function InstallCopy({ command }: { command: string }) {
  const { copied, copy } = useClipboard(1_800);

  return (
    <button
      type="button"
      className={styles.installCopy}
      aria-label={copied ? "Install command copied" : "Copy install command"}
      onClick={() => void copy(command)}
    >
      {copied ? <IconCheck /> : <IconCopy />}
    </button>
  );
}

export function OpenDialogMenuItem() {
  return <DropdownMenuItem onClick={openDemoDialog}>Open dialog</DropdownMenuItem>;
}

export function openDemoDialog() {
  document.querySelector<HTMLButtonElement>("[data-open-dialog]")?.click();
}
