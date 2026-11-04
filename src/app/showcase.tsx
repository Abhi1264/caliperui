import { useId } from "react";
import Link from "next/link";

import {
  Button,
  Checkbox,
  DialogTrigger,
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
  Progress,
  RadioGroup,
  Select,
  Slider,
  Textarea,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  buttonVariants,
} from "@/components";
import { SITE_GITHUB } from "@/lib/site";
import type { ThemeChoice } from "@/lib/theme";

import {
  InstallCopy,
  LiveRuler,
  OpenDialogMenuItem,
  PreviewPicker,
  SiteCommandMenu,
  SiteDialog,
  ThemeToggle,
} from "./showcase-client";
import { COMPONENTS, INSTALL_COMMANDS, PACKAGE_MANAGERS } from "./showcase-data";
import styles from "./page.module.css";

function GitHubMark() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
    </svg>
  );
}

export function Showcase({ theme }: { theme: ThemeChoice }) {
  const spanId = useId();
  const unitId = useId();
  const nameId = useId();
  const noteId = useId();
  const readId = useId();

  return (
    <SiteDialog>
      <div className={styles.page}>
        <a className={styles.skipLink} href="#content">
          Skip to content
        </a>

        <header className={styles.header}>
          <div className={styles.headerInner}>
            <Link className={styles.wordmark} href="/">
              <img className={styles.brandMark} src="/icon.svg" alt="" width={18} height={18} />
              CALIPER UI
            </Link>
            <nav className={styles.headerActions} aria-label="Primary">
              <SiteCommandMenu />
              <Link className={styles.headerLink} href="#components">
                Components
              </Link>
              <Link
                className={styles.headerLink}
                href={SITE_GITHUB}
                rel="noreferrer"
                target="_blank"
              >
                <GitHubMark />
                GitHub
              </Link>
              <ThemeToggle initial={theme} />
            </nav>
          </div>
        </header>

        <main id="content" tabIndex={-1} className={styles.focusTarget}>
          <section className={styles.hero}>
            <LiveRuler />
            <div className={styles.heroTop}>
              <div className={styles.heroCopy}>
                <h1 className={styles.headline}>Caliper UI</h1>
                <p className={styles.lede}>
                  Typed React components on native HTML and Tailwind. React is the only dependency.
                </p>
                <div className={styles.heroActions}>
                  <Link className={buttonVariants({ variant: "solid" })} href="#components">
                    See components
                  </Link>
                </div>

                <div className={styles.install}>
                  <div
                    className={styles.installTabs}
                    role="radiogroup"
                    aria-label="Package manager"
                  >
                    {PACKAGE_MANAGERS.map((manager) => (
                      <label key={manager} className={styles.installTab}>
                        <input
                          id={`pkg-${manager}`}
                          type="radio"
                          name="package-manager"
                          value={manager}
                          defaultChecked={manager === "pnpm"}
                        />
                        {manager}
                      </label>
                    ))}
                  </div>
                  {PACKAGE_MANAGERS.map((manager) => (
                    <div key={manager} className={styles.installRow} data-manager={manager}>
                      <code className={styles.installPrompt}>{INSTALL_COMMANDS[manager]}</code>
                      <InstallCopy command={INSTALL_COMMANDS[manager]} />
                    </div>
                  ))}
                </div>
              </div>

              <div
                id="preview"
                className={`${styles.sandbox} ${styles.focusTarget}`}
                data-preview="button"
              >
                <div className={styles.sandboxHeader}>
                  <p className={styles.panelLabel}>Component preview</p>
                  <div className={styles.previewSelect}>
                    <PreviewPicker />
                  </div>
                </div>

                <div className={styles.sandboxStage}>
                  <div
                    id="preview-button"
                    className={styles.previewPanel}
                    data-preview-panel
                    data-active
                  >
                    <div className={styles.variantControls}>
                      {(["solid", "outline", "ghost", "destructive"] as const).map((variant) => (
                        <Button
                          key={variant}
                          className={styles.variantButton}
                          variant={variant}
                          size="sm"
                        >
                          {variant}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div id="preview-input" className={styles.previewPanel} data-preview-panel>
                    <Input aria-label="Preview input" placeholder="Type in a native input" />
                  </div>

                  <div id="preview-textarea" className={styles.previewPanel} data-preview-panel>
                    <Field label="Note" htmlFor={noteId}>
                      <Textarea
                        id={noteId}
                        rows={3}
                        defaultValue="Jaw rests on the preview width."
                      />
                    </Field>
                  </div>

                  <div id="preview-checkbox" className={styles.previewPanel} data-preview-panel>
                    <Checkbox label="Zero the jaw" defaultChecked />
                  </div>

                  <div id="preview-radio-group" className={styles.previewPanel} data-preview-panel>
                    <RadioGroup
                      legend="Unit"
                      name="preview-unit"
                      defaultValue="px"
                      options={[
                        { value: "px", label: "px" },
                        { value: "pt", label: "pt" },
                        { value: "%", label: "%" },
                      ]}
                    />
                  </div>

                  <div id="preview-field" className={styles.previewPanel} data-preview-panel>
                    <Field label="Name" htmlFor={nameId} hint="Shown under the field.">
                      <Input id={nameId} defaultValue="Caliper" />
                    </Field>
                  </div>

                  <div id="preview-slider" className={styles.previewPanel} data-preview-panel>
                    <Field label="Span" htmlFor={spanId}>
                      <Slider id={spanId} min={0} max={100} defaultValue={64} />
                    </Field>
                  </div>

                  <div id="preview-progress" className={styles.previewPanel} data-preview-panel>
                    <Field label="64%" htmlFor={readId}>
                      <Progress id={readId} max={100} value={64} />
                    </Field>
                  </div>

                  <div id="preview-gauge" className={styles.previewPanel} data-preview-panel>
                    <Gauge
                      label="Reading"
                      min={0}
                      max={100}
                      low={25}
                      high={75}
                      optimum={50}
                      value={64}
                      unit="px"
                    />
                  </div>

                  <div id="preview-select" className={styles.previewPanel} data-preview-panel>
                    <Field label="Unit" htmlFor={unitId}>
                      <Select id={unitId} defaultValue="px">
                        <option value="px">px</option>
                        <option value="pt">pt</option>
                        <option value="%">%</option>
                      </Select>
                    </Field>
                  </div>

                  <div
                    id="preview-dropdown-menu"
                    className={styles.previewPanel}
                    data-preview-panel
                  >
                    <div className={styles.dialogStage}>
                      <p>Arrow keys move. Enter runs the item. Right opens the submenu.</p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Copy token</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>Export</DropdownMenuItem>
                              <OpenDialogMenuItem />
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div id="preview-disclosure" className={styles.previewPanel} data-preview-panel>
                    <Disclosure summary="Button geometry">
                      Control height 32 px. Corner radius 4 px. Focus ring 1 px. Four variants:
                      solid, outline, ghost, destructive.
                    </Disclosure>
                  </div>

                  <div id="preview-kbd" className={styles.previewPanel} data-preview-panel>
                    <div className={styles.keyChord}>
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                      <Kbd>Esc</Kbd>
                    </div>
                  </div>

                  <div id="preview-icons" className={styles.previewPanel} data-preview-panel>
                    <div className={styles.iconRow}>
                      <IconSearch title="Search" />
                      <IconCommand title="Command" />
                      <IconCopy title="Copy" />
                      <IconCheck title="Check" />
                      <IconClose title="Close" />
                    </div>
                  </div>

                  <div id="preview-table" className={styles.previewPanel} data-preview-panel>
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
                  </div>

                  <div id="preview-dialog" className={styles.previewPanel} data-preview-panel>
                    <div className={styles.dialogStage}>
                      <p>Open the dialog, then try Tab, Shift+Tab, and Escape.</p>
                      <DialogTrigger className={buttonVariants({ variant: "solid" })}>
                        Open dialog
                      </DialogTrigger>
                    </div>
                  </div>

                  <div
                    id="preview-command-palette"
                    className={styles.previewPanel}
                    data-preview-panel
                  >
                    <div className={styles.dialogStage}>
                      <p>Use the header command menu, or press ⌘K or Ctrl+K.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className={styles.sheet}>
            <div className={styles.sheetInner}>
              <section
                id="features"
                className={`${styles.section} ${styles.focusTarget}`}
                tabIndex={-1}
              >
                <h2 className={styles.sectionTitle}>What you install</h2>
                <dl className={styles.facts}>
                  <div>
                    <dt>Runtime</dt>
                    <dd>React</dd>
                  </div>
                  <div>
                    <dt>Styling</dt>
                    <dd>Tailwind CSS</dd>
                  </div>
                  <div>
                    <dt>Helper</dt>
                    <dd>cn</dd>
                  </div>
                </dl>

                <h3 className={styles.subTitle}>Command menu</h3>
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
              </section>

              <section
                id="components"
                className={`${styles.section} ${styles.focusTarget}`}
                tabIndex={-1}
              >
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Components</h2>
                  <p className={styles.sectionDescription}>
                    Choose a name to open it in the preview.
                  </p>
                </div>

                <div className={styles.densityShell}>
                  <Table className={styles.table}>
                    <TableCaption>Components and the files they live in.</TableCaption>
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
                            <a className={styles.componentLink} href={`#preview-${row.id}`}>
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
            </div>

            <footer className={styles.footer}>
              <div className={styles.footerInner}>
                <span className={styles.footerWordmark}>
                  <img className={styles.brandMark} src="/icon.svg" alt="" width={18} height={18} />
                  CALIPER UI
                </span>
                <div className={styles.footerLinks}>
                  <Link href="#components">Components</Link>
                  <Link href={SITE_GITHUB} rel="noreferrer" target="_blank">
                    <GitHubMark />
                    GitHub
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </SiteDialog>
  );
}
