"use client";

import { useId, useState, type KeyboardEvent } from "react";

import {
  BentoCard,
  BentoGrid,
  Button,
  CommandPalette,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Disclosure,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Field,
  Gauge,
  IconCheck,
  IconClose,
  IconCommand,
  IconCopy,
  IconSearch,
  Input,
  Kbd,
  Select,
  Slider,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import type { ButtonVariant, CommandGroup } from "@/components";
import { useClipboard } from "@/lib/clipboard";

import styles from "./page.module.css";

type PackageManager = keyof typeof INSTALL_COMMANDS;

const INSTALL_COMMANDS = {
  pnpm: "pnpm add caliper-ui",
  npm: "npm install caliper-ui",
  yarn: "yarn add caliper-ui",
  bun: "bun add caliper-ui",
} as const;

const TOKENS = [
  { value: "#09090b", label: "Canvas" },
  { value: "#121215", label: "Surface" },
  { value: "#18181b", label: "Raised" },
] as const;

const COMPONENTS = [
  {
    id: "button",
    name: "Button",
    behavior: "4 variants · 3 sizes",
    source: "button.tsx",
  },
  {
    id: "input",
    name: "Input",
    behavior: "Native props · invalid state",
    source: "input.tsx",
  },
  {
    id: "dialog",
    name: "Dialog",
    behavior: "Native <dialog> · controlled or uncontrolled",
    source: "dialog.tsx",
  },
  {
    id: "command-palette",
    name: "Command Palette",
    behavior: "Search · arrows · Enter · ⌘/Ctrl K",
    source: "command-palette.tsx",
  },
  {
    id: "table",
    name: "Table",
    behavior: "Semantic parts · horizontal overflow",
    source: "table.tsx",
  },
  {
    id: "kbd",
    name: "Kbd",
    behavior: "Keyboard key labels",
    source: "kbd.tsx",
  },
  {
    id: "field",
    name: "Field",
    behavior: "Visible label · hint · error",
    source: "field.tsx",
  },
  {
    id: "gauge",
    name: "Gauge",
    behavior: "Native <meter> · numeric readout",
    source: "gauge.tsx",
  },
  {
    id: "slider",
    name: "Slider",
    behavior: "Native range input",
    source: "slider.tsx",
  },
  {
    id: "select",
    name: "Select",
    behavior: "Native <select>",
    source: "select.tsx",
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    behavior: "Popover · submenu · separator",
    source: "dropdown-menu.tsx",
  },
  {
    id: "disclosure",
    name: "Disclosure",
    behavior: "Native <details>",
    source: "disclosure.tsx",
  },
  {
    id: "bento-grid",
    name: "Bento Grid",
    behavior: "Dense specification grid",
    source: "bento-grid.tsx",
  },
  {
    id: "icons",
    name: "Icons",
    behavior: "Inline SVGs",
    source: "icons.tsx",
  },
] as const;

type PreviewTab = (typeof COMPONENTS)[number]["id"];

function focusTarget(element: HTMLElement | null) {
  if (!element) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  element.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
  element.focus({ preventScroll: true });
}

function onTabListKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  tabs: readonly string[],
  active: string,
  setActive: (id: string) => void,
) {
  const index = tabs.indexOf(active);
  if (index === -1) return;

  const nextKey =
    event.key === "ArrowRight" || event.key === "ArrowDown"
      ? tabs[(index + 1) % tabs.length]
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? tabs[(index - 1 + tabs.length) % tabs.length]
        : event.key === "Home"
          ? tabs[0]
          : event.key === "End"
            ? tabs[tabs.length - 1]
            : null;

  if (!nextKey) return;

  event.preventDefault();
  setActive(nextKey);
  document.getElementById(`tab-${nextKey}`)?.focus();
}

export function Showcase() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("button");
  const [buttonVariant, setButtonVariant] = useState<ButtonVariant>("solid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [span, setSpan] = useState(64);
  const [unit, setUnit] = useState<"px" | "pt" | "%">("px");
  const [menuAction, setMenuAction] = useState("None");
  const [packageManager, setPackageManager] = useState<PackageManager>("pnpm");
  const { copied, copy } = useClipboard(1_800);
  const installCommand = INSTALL_COMMANDS[packageManager];
  const spanId = useId();
  const unitId = useId();
  const nameId = useId();
  const previewSelectId = useId();

  const commandGroups: readonly CommandGroup[] = [
    {
      id: "primitives",
      label: "Components",
      items: COMPONENTS.map((row) => ({
        id: `preview-${row.id}`,
        label: row.name,
        keywords: [row.id, row.source],
        icon: <IconCommand />,
        onSelect: () => {
          setPreviewTab(row.id);
          focusTarget(document.getElementById("preview"));
        },
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
          onSelect: () => focusTarget(document.getElementById("components")),
        },
        {
          id: "features",
          label: "Go to implementation",
          icon: <IconSearch />,
          onSelect: () => focusTarget(document.getElementById("features")),
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
          onSelect: () => setDialogOpen(true),
        },
      ],
    },
  ];

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="/">
        Skip to content
      </a>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a className={styles.wordmark} href="/">
            CALIPER UI
          </a>
          <nav className={styles.headerActions} aria-label="Primary">
            <Button
              className={styles.searchButton}
              variant="outline"
              size="sm"
              onClick={() => setPaletteOpen(true)}
            >
              <span className={styles.searchLabel}>
                <IconSearch />
                <span>Command menu</span>
              </span>
              <Kbd>⌘K</Kbd>
            </Button>
            <a className={styles.headerLink} href="#components">
              Components
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className={`${styles.hero} grid-bg`}>
          <div className={styles.heroTop}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Source-owned React primitives</p>
              <h1 className={styles.headline}>
                Caliper UI.{" "}
                <span className={styles.headlineSecondary}>Engineered for precision.</span>
              </h1>
              <p className={styles.heroDescription}>
                Typed React components on native browser APIs and Tailwind CSS. No runtime package
                beyond React.
              </p>
              <div className={styles.heroActions}>
                <Button
                  variant="solid"
                  onClick={() => focusTarget(document.getElementById("components"))}
                >
                  Explore components
                </Button>
                <Button
                  variant="outline"
                  onClick={() => focusTarget(document.getElementById("features"))}
                >
                  Review implementation
                </Button>
              </div>

              <div className={styles.install}>
                <div
                  className={styles.installTabs}
                  role="tablist"
                  aria-label="Package manager"
                  onKeyDown={(event) =>
                    onTabListKeyDown(event, Object.keys(INSTALL_COMMANDS), packageManager, (id) =>
                      setPackageManager(id as PackageManager),
                    )
                  }
                >
                  {(Object.keys(INSTALL_COMMANDS) as PackageManager[]).map((manager) => (
                    <button
                      key={manager}
                      id={`tab-${manager}`}
                      type="button"
                      className={styles.installTab}
                      role="tab"
                      aria-selected={packageManager === manager}
                      aria-controls="install-command"
                      tabIndex={packageManager === manager ? 0 : -1}
                      data-active={packageManager === manager}
                      onClick={() => setPackageManager(manager)}
                    >
                      {manager}
                    </button>
                  ))}
                </div>
                <div className={styles.installRow}>
                  <code id="install-command" className={styles.installPrompt}>
                    {installCommand}
                  </code>
                  <button
                    type="button"
                    className={styles.installCopy}
                    aria-label={copied ? "Install command copied" : "Copy install command"}
                    onClick={() => void copy(installCommand)}
                  >
                    {copied ? <IconCheck /> : <IconCopy />}
                  </button>
                </div>
                <p className={styles.copyFeedback} aria-live="polite">
                  {copied ? `Copied: ${installCommand}` : null}
                </p>
              </div>
            </div>

            <div id="preview" className={`${styles.sandbox} ${styles.focusTarget}`} tabIndex={-1}>
              <div className={styles.sandboxHeader}>
                <p className={styles.panelLabel}>Component preview</p>
                <div className={styles.previewSelect}>
                  <DropdownMenu>
                    <DropdownMenuTrigger id={previewSelectId} className="w-full">
                      {COMPONENTS.find((row) => row.id === previewTab)?.name}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {COMPONENTS.map((row) => (
                        <DropdownMenuItem
                          key={row.id}
                          aria-current={previewTab === row.id ? "true" : undefined}
                          onClick={() => setPreviewTab(row.id)}
                        >
                          {row.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div id="preview-panel" className={styles.sandboxStage}>
                {previewTab === "button" ? (
                  <>
                    <p className={styles.microLabel}>Choose a variant</p>
                    <div className={styles.variantControls}>
                      {(["solid", "outline", "ghost", "destructive"] as const).map((variant) => (
                        <Button
                          key={variant}
                          className={styles.variantButton}
                          variant={variant}
                          size="sm"
                          aria-pressed={buttonVariant === variant}
                          onClick={() => setButtonVariant(variant)}
                        >
                          {variant}
                        </Button>
                      ))}
                    </div>
                    <div className={styles.gauge}>
                      <span className={styles.tick} data-edge="top">
                        H 32px
                      </span>
                      <span className={styles.tick} data-edge="left">
                        R 4px
                      </span>
                      <span className={styles.tick} data-edge="right">
                        FOCUS 1px
                      </span>
                      <span className={styles.tick} data-edge="bottom">
                        4 VARIANTS
                      </span>
                      <Button variant={buttonVariant}>Test button</Button>
                    </div>
                    <p className={styles.lastAction}>Selected: {buttonVariant}</p>
                  </>
                ) : null}

                {previewTab === "input" ? (
                  <Input
                    aria-label="Preview input"
                    placeholder="Type in a native input"
                    defaultValue=""
                  />
                ) : null}

                {previewTab === "field" ? (
                  <Field label="Name" htmlFor={nameId} hint="Visible label and hint.">
                    <Input id={nameId} defaultValue="Caliper" />
                  </Field>
                ) : null}

                {previewTab === "slider" ? (
                  <Field label="Span" htmlFor={spanId}>
                    <Slider
                      id={spanId}
                      min={0}
                      max={100}
                      value={span}
                      onChange={(event) => setSpan(Number(event.target.value))}
                    />
                  </Field>
                ) : null}

                {previewTab === "gauge" ? (
                  <Gauge
                    label="Reading"
                    min={0}
                    max={100}
                    low={25}
                    high={75}
                    optimum={50}
                    value={span}
                    unit={unit}
                  />
                ) : null}

                {previewTab === "select" ? (
                  <Field label="Unit" htmlFor={unitId}>
                    <Select
                      id={unitId}
                      value={unit}
                      onChange={(event) => setUnit(event.target.value as "px" | "pt" | "%")}
                    >
                      <option value="px">px</option>
                      <option value="pt">pt</option>
                      <option value="%">%</option>
                    </Select>
                  </Field>
                ) : null}

                {previewTab === "dropdown-menu" ? (
                  <div className={styles.dialogStage}>
                    <p>Arrows, Enter, Escape. Right opens a submenu.</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setMenuAction("Copy token")}>
                          Copy token
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={() => setMenuAction("Export")}>
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setMenuAction("Open dialog");
                                setDialogOpen(true);
                              }}
                            >
                              Open dialog
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <p className={styles.lastAction}>Last action: {menuAction}</p>
                  </div>
                ) : null}

                {previewTab === "disclosure" ? (
                  <Disclosure summary="Button geometry">
                    Control height 32 px. Corner radius 4 px. Focus ring 1 px. Four variants: solid,
                    outline, ghost, destructive.
                  </Disclosure>
                ) : null}

                {previewTab === "kbd" ? (
                  <div className={styles.keyChord}>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                    <Kbd>Esc</Kbd>
                  </div>
                ) : null}

                {previewTab === "icons" ? (
                  <div className={styles.iconRow}>
                    <IconSearch title="Search" />
                    <IconCommand title="Command" />
                    <IconCopy title="Copy" />
                    <IconCheck title="Check" />
                    <IconClose title="Close" />
                  </div>
                ) : null}

                {previewTab === "table" ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Radius</TableCell>
                        <TableCell>4px</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Height</TableCell>
                        <TableCell>32px</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : null}

                {previewTab === "bento-grid" ? (
                  <BentoGrid className="md:grid-cols-2">
                    <BentoCard title="Surface" description="Cards use the raised canvas." />
                    <BentoCard title="Hairline" description="Borders stay at 1px." />
                  </BentoGrid>
                ) : null}

                {previewTab === "dialog" ? (
                  <div className={styles.dialogStage}>
                    <p>Open the dialog, then try Tab, Shift+Tab, Escape, and the close controls.</p>
                    <Button variant="solid" onClick={() => setDialogOpen(true)}>
                      Open dialog
                    </Button>
                  </div>
                ) : null}

                {previewTab === "command-palette" ? (
                  <div className={styles.dialogStage}>
                    <p>Search, arrow keys, Enter, and Escape.</p>
                    <Button variant="solid" onClick={() => setPaletteOpen(true)}>
                      Open command menu
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className={`${styles.sectionFrame} ${styles.focusTarget}`}
          tabIndex={-1}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionKicker}>Implementation</span>
              <h2 className={styles.sectionTitle}>Review the implementation before you copy it.</h2>
            </div>
            <p className={styles.sectionDescription}>
              The preview uses React, native browser APIs, Tailwind CSS, and one local helper.
            </p>
          </div>

          <BentoGrid className={styles.bentoGrid}>
            <BentoCard
              className={styles.bentoCard}
              title="No component-library runtime"
              description="The primitives import React and a local class helper. Dialog behavior uses the browser’s native dialog element."
            >
              <dl className={styles.factList}>
                <div>
                  <dt>Runtime requirement</dt>
                  <dd>React</dd>
                </div>
                <div>
                  <dt>Build-time styling</dt>
                  <dd>Tailwind CSS</dd>
                </div>
                <div>
                  <dt>Local helper</dt>
                  <dd>cn</dd>
                </div>
              </dl>
            </BentoCard>

            <BentoCard
              className={styles.bentoCard}
              title="Keyboard behavior"
              description="Keys supported by the command menu and dialog."
            >
              <div className={styles.keyGrid}>
                <div className={styles.keyBinding}>
                  <span>Open command menu</span>
                  <span className={styles.keyChord}>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                  </span>
                </div>
                <div className={styles.keyBinding}>
                  <span>Move selection</span>
                  <span className={styles.keyChord}>
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                  </span>
                </div>
                <div className={styles.keyBinding}>
                  <span>Run selected action</span>
                  <Kbd>Enter</Kbd>
                </div>
                <div className={styles.keyBinding}>
                  <span>Close</span>
                  <Kbd>Esc</Kbd>
                </div>
              </div>
            </BentoCard>

            <BentoCard
              className={styles.bentoCard}
              title="Surface colors"
              description="Three background colors used by this preview."
            >
              <div className={styles.swatchGrid}>
                {TOKENS.map((token) => (
                  <div key={token.value} className={styles.swatch}>
                    <span className={styles.swatchColor} style={{ backgroundColor: token.value }} />
                    <span className={styles.swatchText}>
                      {token.label}
                      <br />
                      {token.value}
                    </span>
                  </div>
                ))}
              </div>
            </BentoCard>
          </BentoGrid>
        </section>

        <section
          id="components"
          className={`${styles.sectionFrame} ${styles.focusTarget}`}
          tabIndex={-1}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionKicker}>Inventory</span>
              <h2 className={styles.sectionTitle}>Components in this library.</h2>
            </div>
            <p className={styles.sectionDescription}>
              Each name opens that primitive in the preview.
            </p>
          </div>

          <div className={styles.densityShell}>
            <Table className={styles.table}>
              <TableCaption>Implemented UI primitives and their source files.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Component</TableHead>
                  <TableHead scope="col">Behavior</TableHead>
                  <TableHead scope="col">Source file</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COMPONENTS.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className={styles.componentCell}>
                      <a
                        className={styles.componentLink}
                        href="#preview"
                        aria-current={previewTab === row.id ? "true" : undefined}
                        onClick={() => setPreviewTab(row.id)}
                      >
                        {row.name}
                      </a>
                    </TableCell>
                    <TableCell>{row.behavior}</TableCell>
                    <TableCell className={styles.sourceCell}>{row.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerWordmark}>CALIPER UI</span>
          <a href="#components">Components</a>
        </div>
      </footer>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        groups={commandGroups}
        title="Command menu"
        description="Search components, sections, and actions."
        placeholder="Search components…"
        emptyMessage="No matching commands."
        trigger={false}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className={styles.dialogContent}>
          <DialogTitle className={styles.dialogTitle}>Dialog demo</DialogTitle>
          <DialogDescription className={styles.dialogDescription}>
            This example uses the browser’s native dialog element. Press Escape, click the backdrop,
            or choose Close.
          </DialogDescription>
          <div className={styles.dialogActions}>
            <Button variant="solid" onClick={() => setDialogOpen(false)}>
              Close dialog
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
