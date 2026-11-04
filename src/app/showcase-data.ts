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
    behavior: "4 variants, 3 sizes",
    source: "button.tsx",
  },
  {
    id: "input",
    name: "Input",
    behavior: "Native input, invalid state",
    source: "input.tsx",
  },
  {
    id: "dialog",
    name: "Dialog",
    behavior: "Native dialog, controlled or uncontrolled",
    source: "dialog.tsx",
  },
  {
    id: "command-palette",
    name: "Command Palette",
    behavior: "Search, arrows, Enter, ⌘K or Ctrl+K",
    source: "command-palette.tsx",
  },
  {
    id: "table",
    name: "Table",
    behavior: "Semantic table, scrolls sideways",
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
    behavior: "Label, hint, and error",
    source: "field.tsx",
  },
  {
    id: "gauge",
    name: "Gauge",
    behavior: "Native meter and a readout",
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
    behavior: "Native select",
    source: "select.tsx",
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    behavior: "Popover menu, submenu, separator",
    source: "dropdown-menu.tsx",
  },
  {
    id: "disclosure",
    name: "Disclosure",
    behavior: "Native details",
    source: "disclosure.tsx",
  },
  {
    id: "icons",
    name: "Icons",
    behavior: "Inline SVGs",
    source: "icons.tsx",
  },
] as const;

export type PreviewTab = (typeof COMPONENTS)[number]["id"];
