# @tuuject/koi-react

Koi components for React web: [Base UI](https://base-ui.com) for behavior, [Panda CSS](https://panda-css.com) v2 for styling. Buttons, inputs, select, dialog, table, toast and the rest of the Koi set, with one token source for themes and palettes.

Koi is a design system, so the package ships no prebuilt CSS. Your app's Panda build generates it from the published design system: tokens, recipes, every recipe variant and the page-level global styles.

## Install

```sh
pnpm add @tuuject/koi-react @tuuject/koi-tokens react react-dom
pnpm add -D @pandacss/dev
```

`@tuuject/koi-react` needs Panda CSS v2. The published artifacts are built with Panda `2.1.x`, and the package declares that peer range.

## Configure Panda CSS

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  // Loads @tuuject/koi-react's published preset + build info: tokens, recipes, all variants, global styles.
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
});
```

Add the layer order to your app's CSS entry, then let Panda's PostCSS plugin generate the CSS:

```css
/* src/index.css */
@layer reset, base, tokens, recipes, utilities;
```

```js
// postcss.config.cjs
module.exports = { plugins: { '@pandacss/dev/postcss': {} } };
```

Do not also add `@tuuject/koi-tokens/panda` to `presets` or scan `node_modules/@tuuject/koi-react` in `include`: `designSystem` already provides the preset, and the generated build info covers every class the components can produce.

## Theme and palette

Import the theme bootstrap before your CSS in the app entry (or inline the same file in `<head>` from a tiny build step) so the first paint already has the right theme. It sets `<html data-theme="light|dark">` and follows the OS; `<html data-palette="rose">` picks another built-in palette.

```ts
// src/main.tsx, before the CSS import
import '@tuuject/koi-tokens/theme-init.js';
```

## Use

```tsx
import { Button, Card, Input } from '@tuuject/koi-react';
import { css } from '../styled-system/css';

export function Form() {
  return (
    <Card>
      <Input placeholder="昵称" />
      <Button>保存</Button>
    </Card>
  );
}
```

Components use their own generated runtime; write app styles with your app's `styled-system` (it re-exports Koi's runtime and tokens).

## Admin template

The repository's `apps/admin` is a copyable Vite + TanStack Router admin application built only on these packages. Copy its `src/`, `index.html`, `vite.config.ts` and CSS layer, give it its own `panda.config.ts` with `designSystem: '@tuuject/koi-react'`, and replace the demo API. The step-by-step checklist, tarball workflow and migration boundaries are in [`agent-doc/consuming-koi.md`](https://github.com/tuuject/design/blob/main/agent-doc/consuming-koi.md).

## Links

- Repository, design spec and Storybook instructions: <https://github.com/tuuject/design>
- Tokens on their own, without the components: [`@tuuject/koi-tokens`](https://www.npmjs.com/package/@tuuject/koi-tokens)
