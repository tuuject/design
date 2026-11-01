# Koi

A soft, rounded design system, grown out of tcdw's Koi blog theme. One set of tokens; components for DOM web apps (Base UI + Panda CSS v2) and for Expo apps (Tamagui, in progress).

```sh
nvm use            # the Node version in .nvmrc
pnpm install
pnpm dev           # builds tokens, runs Panda codegen, starts Storybook (localhost:6006; log in .temp/dev-storybook.log)
pnpm shots         # screenshots of every story, light + dark
pnpm check         # contrast, raw-color / raw-size / headless / core checks, typecheck
```

- Working with an AI agent: start with `AGENTS.md`; topic docs and the plan are in `agent-doc/`.
- Design spec: `docs/spec/README.md` and `docs/spec/components/`.
- Previous implementation, for reference: `reference/legacy-web/example.html`.

## Use Koi in an app

```sh
pnpm add @tuuject/koi-react @tuuject/koi-tokens react react-dom
pnpm add -D @pandacss/dev
```

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
});
```

Add `@layer reset, base, tokens, recipes, utilities;` to the app's CSS entry and Panda's PostCSS plugin; the full setup is in [`packages/react/README.md`](packages/react/README.md). `designSystem` loads Koi's published preset and build info, so consumers do not add `presets`, import recipes, or scan `node_modules`.

To copy the Admin template (`apps/admin`, Vite + TanStack Router) into another repo, follow [agent-doc/consuming-koi.md](agent-doc/consuming-koi.md). It covers the four files to rewrite, local tarballs before the packages are on npm, and the Tailwind / Rsbuild / i18n boundaries.

## Releasing

```sh
pnpm check            # static checks + typecheck
pnpm build:packages   # tokens → core → react; runs `panda lib`
pnpm pack:packages    # tarballs in .temp/packs, no publish (optional)
pnpm publish:packages # builds, then publishes the public packages in dependency order
```

`@tuuject/koi-tokens`, `@tuuject/koi-core` and `@tuuject/koi-react` publish; `@tuuject/koi-native` stays private until the first native components land. Locally the workspace imports TypeScript sources; `publishConfig` points the published tarballs at `dist` (see [agent-doc/publishing.md](agent-doc/publishing.md)).


| Package | What |
| --- | --- |
| `packages/tokens` | `src/tokens.json` → CSS variables, Panda preset, theme-init script, plain numbers for every size, runtime palettes, React Native values. Contrast checks. |
| `packages/core` | Each component's props contract, UI copy and pure helpers, shared by web and native. No DOM. |
| `packages/react` | Web components: Button, IconButton, Spinner, Skeleton, Badge, Divider, Card, Alert, Link, Field, Input, Textarea, Select, SelectPanel, Checkbox, RadioGroup, Switch, Tabs, Tooltip, Avatar, Progress, Dialog, Pagination, Tag, Toast. |
| `packages/native` | Expo components on Tamagui. So far the Tamagui config, built from the tokens. |
| `apps/storybook` | Storybook: an introduction to Koi and every component's stories. Also the visual test bed (`pnpm shots`). |
