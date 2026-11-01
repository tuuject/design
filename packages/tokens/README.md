# @tuuject/koi-tokens

Koi's design tokens, generated from one source (`src/tokens.json`): colors, palettes, type, spacing, radii, sizes, shadows, blur, layers and each component's own dimensions.

Most apps get these through `@tuuject/koi-react` and its Panda design system. Use this package directly for a non-Panda page, a React Native app, or your own tooling.

## Exports

| Import | What |
| --- | --- |
| `@tuuject/koi-tokens/tokens.css` | Every token as a CSS variable. Light by default; `<html data-theme="dark">` and `data-palette="rose"` swap themes. |
| `@tuuject/koi-tokens/theme-init.js` | Inline in `<head>`: sets `data-theme` from the OS before first paint, follows OS changes, exposes `koiSetTheme`, `koiSetFont`, `koiSetPalette`. |
| `@tuuject/koi-tokens/panda` | The Panda CSS preset (tokens, semantic tokens, text styles, keyframes). You do not need it when using `designSystem: '@tuuject/koi-react'`. |
| `@tuuject/koi-tokens/dimensions` | Every size as a plain number in px, including per-component sizes. |
| `@tuuject/koi-tokens/palette` | Palettes at runtime: `palettes`, `createColors(palette, theme)`, `checkPalette(palette)`. |
| `@tuuject/koi-tokens/native` | Pre-resolved colors per theme and numbers for React Native. |
| `@tuuject/koi-tokens/fonts.css` | The optional ChillRoundF subsets (`<html data-font="chill">`). |
| `@tuuject/koi-tokens/tokens.json` | The source data. |

## Plain CSS

```html
<link rel="stylesheet" href="/node_modules/@tuuject/koi-tokens/tokens.css" />
<script src="/node_modules/@tuuject/koi-tokens/theme-init.js"></script>
```

Then style with the variables (`var(--surface)`, `var(--text-muted)`, `var(--radius-lg)`…). The `koi-type-*` classes apply Koi's text styles.

## Panda CSS

```ts
import { defineConfig } from '@pandacss/dev';
import koiPreset from '@tuuject/koi-tokens/panda';

export default defineConfig({
  presets: ['@pandacss/preset-base', koiPreset],
});
```

If you use `@tuuject/koi-react`, skip this and set `designSystem: '@tuuject/koi-react'` instead: that preset already contains the tokens, and adding both would duplicate them.
