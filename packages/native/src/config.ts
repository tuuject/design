import { createFont, createTamagui, createTokens, isWeb, type CreateTamaguiProps } from '@tamagui/core';
import { layers, radii, sizes, space } from '@koi/tokens/dimensions';
import { fontStacks, type } from '@koi/tokens/native';
import { createColors, defaultPalette, palettes, type Palette, type RoleToken, type Theme } from '@koi/tokens/palette';

// Koi as a Tamagui config, built from @koi/tokens, so iOS, Android and Expo web read the same numbers and colors as
// @koi/react. Nothing here is hand-tuned: change tokens.json, not this file.

/** `text-muted` → `textMuted`: Tamagui's theme keys are camelCase; Koi's role names are kebab-case everywhere else. */
type Camel<S extends string> = S extends `${infer H}-${infer T}` ? `${H}${Capitalize<Camel<T>>}` : S;
export type KoiThemeKey = Camel<RoleToken>;
const camel = (s: string) => s.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());

/**
 * Every role token as a Tamagui theme for one palette and appearance, plus the keys Tamagui's own primitives read
 * (`background`, `color`, `borderColor`, `placeholderColor`, `outlineColor`).
 */
export function createKoiTheme(palette: Palette, appearance: Theme) {
  const colors = createColors(palette, appearance);
  const theme = Object.fromEntries(Object.entries(colors).map(([k, v]) => [camel(k), v])) as Record<KoiThemeKey, string>;
  return {
    ...theme,
    background: theme.pageBg,
    color: theme.text,
    borderColor: theme.border,
    placeholderColor: theme.textMuted,
    outlineColor: theme.focusRing,
  };
}

/**
 * `light` and `dark` in the default palette, and `light_<id>` / `dark_<id>` for every other built-in palette and
 * each one in `extra` (`<Theme name="rose">` switches to it). Run a user-made palette through `checkPalette()`
 * from @koi/tokens/palette before passing it here.
 */
export function createKoiThemes(extra: Record<string, Palette> = {}) {
  const all: Record<string, Palette> = { ...palettes, ...extra };
  const themes: Record<string, ReturnType<typeof createKoiTheme>> = {
    light: createKoiTheme(all[defaultPalette], 'light'),
    dark: createKoiTheme(all[defaultPalette], 'dark'),
  };
  for (const [id, palette] of Object.entries(all)) {
    if (id === defaultPalette) continue;
    themes[`light_${id}`] = createKoiTheme(palette, 'light');
    themes[`dark_${id}`] = createKoiTheme(palette, 'dark');
  }
  return themes;
}

// Sizes keep Koi's names: `$control-md`, `$icon`, space `$3`, radius `$panel`, zIndex `$dialog`. `true` is what
// Tamagui uses when a component asks for the default.
export const tokens = createTokens({
  space: { ...space, true: space[4] },
  size: { ...sizes, true: sizes['control-md'] },
  radius: { ...radii, true: radii.lg },
  zIndex: { ...layers },
  // Colors are themes only: roles follow the palette and dark mode, and Koi components never use palette steps.
  color: {},
});

type TextStyle = keyof typeof type;
const byStyle = <K extends 'fontSize' | 'lineHeight' | 'fontWeight'>(key: K) =>
  Object.fromEntries(Object.entries(type).map(([name, s]) => [name, s[key]])) as { [N in TextStyle]: (typeof type)[N][K] };

/**
 * Koi's text styles as one Tamagui font: `fontSize="$body"` (and the same key for lineHeight and fontWeight) gives
 * the `body` style. On the web the family is Koi's system stack (`fontStacks.chill` for ChillRoundF); on iOS and
 * Android it's the system font unless `family` names a loaded one.
 */
export function createKoiFont(family: string = isWeb ? fontStacks.sans : 'System') {
  return createFont({
    family,
    size: { ...byStyle('fontSize'), true: type.body.fontSize },
    lineHeight: { ...byStyle('lineHeight'), true: type.body.lineHeight },
    weight: { ...byStyle('fontWeight'), true: type.body.fontWeight },
  });
}

export interface KoiConfigOptions {
  /** More palettes besides the built-in ones, as `light_<id>` / `dark_<id>` themes (a user's, say). */
  palettes?: Record<string, Palette>;
  /** The font family; see createKoiFont. */
  fontFamily?: string;
  /** The app's animation driver: Koi doesn't pick one (react-native, reanimated or CSS). */
  animations?: CreateTamaguiProps['animations'];
}

export function createKoiConfig({ palettes: extra, fontFamily, animations }: KoiConfigOptions = {}) {
  const font = createKoiFont(fontFamily);
  return createTamagui({
    tokens,
    themes: createKoiThemes(extra),
    fonts: { body: font, heading: font },
    ...(animations ? { animations } : null),
    settings: { onlyAllowShorthands: false },
  });
}

/** The default config: built-in palettes, system font, no animation driver. */
export const koiConfig = createKoiConfig();
export type KoiConfig = typeof koiConfig;
