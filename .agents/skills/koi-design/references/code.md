# Writing Koi styles in code

## Web (`@koi/react`, Panda CSS)

- Styles go through `css({...})` or a recipe. JSX style props are off (`jsxStyleProps: 'none'`).
- Token names in `css()`:
  - colors by role name: `bg: 'surface'`, `color: 'text-muted'`, `borderColor: 'border-control'`
  - spacing as **bare numbers**: `padding: '6'`, `gap: '4'`. `'space-4'` silently generates an empty rule
  - radius / shadow / size by short name: `borderRadius: 'xl'`, `boxShadow: 'float'`, `height: 'control-md'`
  - type: `textStyle: 'body'`
  - motion: `transitionDuration: 'fast'`, `transitionTimingFunction: 'spring'`
  - layers: `zIndex: 'popup'`
  - responsive: `md: {...}` or `{ base: ..., md: ... }` (no underscore). Nested selectors start with `&` (`'& [data-x]'` is a descendant, `'&[data-x]'` the same element)
- `width: 'full'` isn't a token here; write `'100%'`.
- Generated code is imported by package name (`@koi/react/styled-system/css`), never by relative path.
- One-off styles stay inline on the JSX; hoist into a local `s` object only when used twice in the file.
- Component-specific sizes come from `@koi/tokens/dimensions` (`components.*`, `toPx()` in recipes). A size that only makes sense on the web carries `// koi-web-only: <reason>`.
- Theme, palette and font are attributes on `<html>` set by `theme-init.js` (`koiSetTheme`, `koiSetPalette`, `koiSetFont`). Inline it in `<head>` to avoid a flash.
- Without Panda, `@koi/tokens/tokens.css` exposes the same tokens as CSS variables (`--surface`, `--radius-panel`).
- Inside the library, recipes read component state through `state.*` / `vars.*`, never Base UI's `data-*` attributes (`agent-doc/headless.md`). More Panda pitfalls: `agent-doc/web-components.md`.

## Native (`@koi/native`, Tamagui)

- Colors are theme keys in camelCase: `$surface`, `$textMuted`, `$onPrimarySolid`. There are no color tokens.
- Sizes `$control-md`, `$icon`; space `$1`…`$16`; radii `$sm`, `$lg`, `$xl`, `$panel`, `$dialog`, `$full`; type `fontSize="$body" lineHeight="$body" fontWeight="$body"`.
- Component sizes: `import { components } from '@koi/tokens/dimensions'`.
- Glass is `expo-blur`'s `BlurView` under the translucent role color. Shadows are per platform (`shadow*` on iOS, `elevation` on Android). Press feedback is the platform's own, not the web ripple.
- Touch has no hover: no hover-only affordance (flyouts, tooltips) may carry essential function.
- Mapping from web recipes to Tamagui, and what web has that native must solve differently: `agent-doc/native.md`.
