# Caliper UI

Typed React primitives on native browser APIs and Tailwind. `dependencies` is empty. React is the only runtime.

Live site: [caliperui.abhinavkumar.site](https://caliperui.abhinavkumar.site)

This repo is managed with pnpm.

## Install

```sh
pnpm add caliper-ui
```

The published package also installs with npm, Yarn, or Bun. Peers: `react` and `react-dom` (18+). The host app must compile Tailwind.

Next.js:

```ts
const nextConfig = {
  transpilePackages: ["caliper-ui"],
};

export default nextConfig;
```

```ts
import { Button } from "caliper-ui/button";
import { Dialog } from "caliper-ui/dialog";
```

The barrel `import { Button } from "caliper-ui"` still works. Other entry points: `input`, `field`, `select`, `slider`, `gauge`, `kbd`, `table`, `bento-grid`, `command-palette`, `disclosure`, `icons`, `cn`, `clipboard`, `styles.css`.

## Primitives

| Primitive | What it is |
| --- | --- |
| `Button` | Variants and sizes on a native `<button>` |
| `Input` | Native text input |
| `Field` | Visible label, hint, and error |
| `Select` | Native `<select>` |
| `Slider` | Native range input |
| `Gauge` | Native `<meter>` plus a numeric readout |
| `Kbd` | Keyboard key labels |
| `Table` | Semantic table parts |
| `BentoGrid` / `BentoCard` | Dense specification grid |
| `Dialog` | Controlled or uncontrolled `<dialog>` |
| `CommandPalette` | Searchable command menu (`⌘`/`Ctrl`+`K`) |
| `Disclosure` | Native `<details>` |
| Icons | Inline SVGs |

Helpers: `cn`, `copyToClipboard`, `useClipboard`. Tokens live in `caliper-ui/styles.css`.

## Showcase

```sh
pnpm install
pnpm dev
```

`pnpm typecheck` checks the tree. `pnpm build` builds the Next.js preview. Consumers compile the published `.ts`/`.tsx` files.
