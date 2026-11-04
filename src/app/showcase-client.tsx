"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

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
          Press Escape, click outside the dialog, or choose Close.
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
      triggerClassName={styles.headerCommand}
      trigger={
        <>
          <span className={styles.searchLabel}>
            <IconSearch />
            <span>Command menu</span>
          </span>
          <Kbd className={styles.headerKbd}>⌘K</Kbd>
        </>
      }
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

const SCALE_MARKS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100] as const;
type Theme = "light" | "dark" | "system";

export function ThemeToggle({ initial }: { initial: Theme }) {
  const [mode, setMode] = useState<Theme>(initial);

  return (
    <label className={styles.themeControl}>
      <span className="sr-only">Theme</span>
      <select
        className={styles.themeSelect}
        value={mode}
        onChange={(event) => {
          const next = event.target.value as Theme;
          document.cookie = `caliper-theme=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
          document.documentElement.setAttribute("data-theme", next);
          setMode(next);
        }}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </label>
  );
}

function motionReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LiveRuler() {
  const rulerRef = useRef<HTMLDivElement>(null);
  const restRef = useRef(0);
  const trackingRef = useRef(false);
  const [reading, setReading] = useState<number | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (motionReduced()) return;
    const ruler = rulerRef.current;
    const preview = document.getElementById("preview");
    if (!ruler || !preview) return;

    const measure = () => {
      const nextWidth = ruler.getBoundingClientRect().width;
      const next = Math.round(
        Math.min(Math.max(preview.getBoundingClientRect().width, 0), nextWidth),
      );
      restRef.current = next;
      setWidth(nextWidth);
      if (!trackingRef.current) setReading(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ruler);
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  function point(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return Math.round(Math.min(Math.max(event.clientX - rect.left, 0), rect.width));
  }

  function park() {
    trackingRef.current = false;
    setReading(restRef.current);
  }

  return (
    <div className={styles.rulerRow}>
      <div
        ref={rulerRef}
        className={styles.ruler}
        aria-hidden="true"
        onPointerDown={(event) => {
          if (motionReduced() || event.pointerType === "mouse") return;
          event.currentTarget.setPointerCapture(event.pointerId);
          trackingRef.current = true;
          setReading(point(event));
        }}
        onPointerMove={(event) => {
          if (motionReduced()) return;
          if (
            event.pointerType !== "mouse" &&
            !event.currentTarget.hasPointerCapture(event.pointerId)
          ) {
            return;
          }
          trackingRef.current = true;
          setReading(point(event));
        }}
        onPointerUp={(event) => {
          if (event.pointerType === "mouse") return;
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          park();
        }}
        onPointerCancel={park}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") park();
        }}
      >
        {SCALE_MARKS.map((mark) => (
          <span key={mark} style={{ left: mark }}>
            {mark}
          </span>
        ))}
        {reading !== null ? (
          <span
            className={styles.jaw}
            data-flip={width - reading < 56 ? true : undefined}
            style={{ left: reading }}
          >
            <span className={styles.jawRead}>{reading}</span>
          </span>
        ) : null}
      </div>
      <span className={styles.rulerUnit} aria-hidden="true">
        px
      </span>
    </div>
  );
}
