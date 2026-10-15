# @koi/native

Koi for Expo apps: iOS, Android and Expo web, on **Tamagui** (2.4.x, the line Bilisound's `apps/mobile-next` uses). Expo web renders through Tamagui too; DOM web apps use `@koi/react`. Both build on the same `@koi/tokens` and `@koi/core`.

So far it's the Tamagui config; components come next (`agent-doc/plan.md`, Phase 3).

```ts
import { createKoiConfig, type KoiConfig } from '@koi/native';
import { TamaguiProvider } from '@tamagui/core';

const config = createKoiConfig({ animations /* the app's driver */, palettes: { user: savedPalette } });
declare module '@tamagui/core' { interface TamaguiCustomConfig extends KoiConfig {} }
// <TamaguiProvider config={config} defaultTheme="light">…  <Theme name="rose">…
```

- **Tokens** keep Koi's names: size `$control-md` / `$icon`, space `$3`, radius `$panel`, zIndex `$dialog`.
- **Themes**: `light` / `dark` in the default palette, `light_<id>` / `dark_<id>` for `rose` and every palette passed in. Keys are the role tokens in camelCase (`text-muted` → `$textMuted`), plus `background`, `color`, `borderColor`, `placeholderColor` and `outlineColor` for Tamagui's own primitives. Run a user-made palette through `checkPalette()` (`@koi/tokens/palette`) first.
- **Font**: one font whose keys are Koi's text styles: `fontSize="$body"`, with the same key for `lineHeight` and `fontWeight`. Koi's system stack on the web, the system font on iOS / Android; `fontFamily` names another (ChillRoundF needs a full font file loaded natively).
- **Not chosen here**: the animation driver (react-native, reanimated or CSS) and media queries. The app passes `animations`.
- Every value comes from tokens.json through `@koi/tokens` (`createColors`, `dimensions`, `native`). Change it there, not in `src/config.ts`.

How to write a native component, what maps to what in Tamagui, and what the web does that native needs another answer for: [`agent-doc/native.md`](../../agent-doc/native.md).
