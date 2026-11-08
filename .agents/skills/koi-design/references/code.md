# Writing Koi styles in code

## Web (`@tuuject/koi-react`, Panda CSS)

- Styles go through `css({...})` or a recipe. JSX style props are off (`jsxStyleProps: 'none'`).
- Token names in `css()`:
  - colors by role name: `bg: 'surface'`, `color: 'text-muted'`, `borderColor: 'border-control'`
  - spacing by **step key**, as a string or a number: `padding: '6'` and `padding: 6` both resolve to `var(--spacing-6)`. `'space-4'` silently generates an empty rule
  - radius / shadow / size by short name: `borderRadius: 'xl'`, `boxShadow: 'float'`, `height: 'control-md'`
  - type: `textStyle: 'body'`
  - motion: `transitionDuration: 'fast'`, `transitionTimingFunction: 'spring'`
  - layers: `zIndex: 'popup'`
  - responsive: `md: {...}` or `{ base: ..., md: ... }` (no underscore). Nested selectors start with `&` (`'& [data-x]'` is a descendant, `'&[data-x]'` the same element)
- `width: 'full'` isn't a token here; write `'100%'`.
- Panda extracts styles statically: a value computed at runtime (from props, a function call, `.join()`) is dropped without a warning. Write a multi-layer value as one string literal and reach tokens inside it with `token()`: `backgroundImage: 'linear-gradient(token(colors.divider), token(colors.divider))'`, `top: 'calc(var(--app-header-offset) + token(spacing.6))'`.
- Generated code is imported by package name (`@tuuject/koi-react/styled-system/css`), never by relative path. In a consumer project, `css()` / `cx()` come from that published subpath or from the app's own generated `styled-system`; there is no `packages/react` to reach into.
- One-off styles stay inline on the JSX; hoist into a local `s` object only when used twice in the file.
- Component-specific sizes come from `@tuuject/koi-tokens/dimensions` (`components.*`, `toPx()` in recipes). A size that only makes sense on the web carries `// koi-web-only: <reason>`.
- Theme, palette and font are attributes on `<html>` set by `theme-init.js` (`koiSetTheme`, `koiSetPalette`, `koiSetFont`). Inline it in `<head>` to avoid a flash. A consumer app must not keep a second `.dark`-class theme system beside it.
- A consumer's Panda config is `designSystem: '@tuuject/koi-react'` plus its own `include`; do not copy koi-ui's presets, recipes or `staticCss` into it.
- **Don't remount an overlay already open.** A Dialog mounted with `open` skips its enter transition. To reset a form per open, put the `key` on the form inside, not on the Dialog. Keep `open` separate from the data the dialog shows, so the content doesn't vanish while the exit fade plays (`agent-doc/admin.md`).
- Without Panda, `@tuuject/koi-tokens/tokens.css` exposes the same tokens as CSS variables (`--surface`, `--radius-panel`).
- Inside the library, recipes read component state through `state.*` / `vars.*`, never Base UI's `data-*` attributes (`agent-doc/headless.md`). More Panda pitfalls: `agent-doc/web-components.md`.

## Native (`@tuuject/koi-native`, Tamagui)

- Colors are theme keys in camelCase: `$surface`, `$textMuted`, `$onPrimarySolid`. There are no color tokens.
- Sizes `$control-md`, `$icon`; space `$1`…`$16`; radii `$sm`, `$lg`, `$xl`, `$panel`, `$dialog`, `$full`; type `fontSize="$body" lineHeight="$body" fontWeight="$body"`.
- Component sizes: `import { components } from '@tuuject/koi-tokens/dimensions'`.
- Glass is `expo-blur`'s `BlurView` under the translucent role color. Shadows are per platform (`shadow*` on iOS, `elevation` on Android). Press feedback is the platform's own, not the web ripple.
- Touch has no hover: no hover-only affordance (flyouts, tooltips) may carry essential function.
- Mapping from web recipes to Tamagui, and what web has that native must solve differently: `agent-doc/native.md`.
