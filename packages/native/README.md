# @koi/native (not started)

React Native components for Koi. The stack isn't chosen yet; that's the first decision of Phase 3 in `docs/plan.md`.

What already exists for it: `@koi/core` (each component's props contract `<Name>OwnProps`, `ChangeDetails<E>`, the copy and the pure helpers; build `<Name>Props` on them, see `docs/core.md`) `@koi/tokens/palette` (`createColors(palette, theme)` for every role token under any palette, built-in or user-made, and `checkPalette()` for user-made ones) and `@koi/tokens/native` (`packages/tokens/dist/native.ts`), with every color resolved per theme to hex/rgba (RN can't read `oklch()` or CSS variables), and spacing, radii, sizes and type as plain numbers.

Things the web version does that need a native answer:

| Web | Native |
| --- | --- |
| `backdrop-filter` glass (`surface-glass`, Dialog backdrop) | `expo-blur` `BlurView`, with the translucent role color on top |
| Skeleton shimmer synced across the page (`background-attachment: fixed`) | Not possible as-is. Reanimated + a linear gradient per placeholder, or one shared animated value driving all of them |
| ChillRoundF as 121 `unicode-range` woff2 subsets | Native needs a full TTF/OTF (large for CJK), or use the system font (PingFang SC / Noto Sans CJK). Decide with the web font decision |
| Hover flyouts in the horizontal NavMenu | No hover on touch: use native tabs / a drawer |
| `shadow-float` CSS shadows | iOS `shadow*` props, Android `elevation`; build per platform |
| `prefers-color-scheme` / `data-theme` | `useColorScheme()` choosing `colors.light` / `colors.dark` |
