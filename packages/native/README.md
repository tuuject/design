# @koi/native

Koi for Expo apps: iOS, Android and Expo web, on **Tamagui** (2.4.x, the line Bilisound's `apps/mobile-next` uses). Expo web renders through Tamagui too; DOM web apps use `@koi/react`. Both build on the same `@koi/tokens` and `@koi/core`.

So far it's the Tamagui config; components come next (`docs/plan.md`, Phase 3).

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

Things the web version does that need a native answer:

| Web | Native |
| --- | --- |
| `backdrop-filter` glass (`surface-glass`, Dialog backdrop) | `expo-blur` `BlurView`, with the translucent role color on top |
| Skeleton shimmer synced across the page (`background-attachment: fixed`) | Not possible as-is. Reanimated + a linear gradient per placeholder, or one shared animated value driving all of them |
| ChillRoundF as 121 `unicode-range` woff2 subsets | Native needs a full TTF/OTF (large for CJK), or use the system font (PingFang SC / Noto Sans CJK). Decide with the web font decision |
| Hover flyouts in the horizontal NavMenu | No hover on touch: use native tabs / a drawer |
| `shadow-float` CSS shadows | iOS `shadow*` props, Android `elevation`; build per platform |
| `prefers-color-scheme` / `data-theme` | `useColorScheme()` choosing `colors.light` / `colors.dark` |
