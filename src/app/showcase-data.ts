export const INSTALL_COMMANDS = {
  pnpm: "pnpm add caliper-ui",
  npm: "npm install caliper-ui",
  yarn: "yarn add caliper-ui",
  bun: "bun add caliper-ui",
} as const;

export type PackageManager = keyof typeof INSTALL_COMMANDS;

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;

export const COMPONENTS = [
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
    behavior: "Menu picker · form value",
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

export type PreviewTab = (typeof COMPONENTS)[number]["id"];
