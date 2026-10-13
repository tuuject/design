// Palettes at runtime, on any platform (no DOM, no React Native). dist/palette.ts binds this to the generated data;
// import from `@koi/tokens/palette`, not from here.
//
// A palette swaps the primary-* and accent-* scales. Every role that points at them follows, in both themes.
// Colors here are hex (#rrggbb) or rgba(): what React Native reads, and what a theme editor usually produces.

export const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export type Shade = (typeof SHADES)[number];
/** One scale, light to dark: #rrggbb or rgba(r, g, b, a) per shade. */
export type Scale = Readonly<Record<Shade, string>>;
/** What a palette swaps. Same shape as a Tailwind theme's two brand scales. */
export interface Palette {
  readonly primary: Scale;
  readonly accent: Scale;
}
export type Theme = 'light' | 'dark';

/** A role's value in one theme: a literal color, or another token (at an alpha). */
export type RoleValue = string | { readonly ref: string; readonly alpha?: number };

export interface PaletteKitData<Role extends string> {
  /** Every role token per theme. */
  readonly roles: Readonly<Record<Role, Readonly<Record<Theme, RoleValue>>>>;
  /** The scales a palette doesn't swap (secondary-*, warning-*, error-*), plus white and black. */
  readonly fixed: Readonly<Record<string, string>>;
  /** src/contrast-pairs.json: [foreground, background, ground?]; text needs 4.5:1, ui 3:1. */
  readonly pairs: Readonly<Record<'text' | 'ui', readonly (readonly string[])[]>>;
}

export interface ContrastFailure {
  theme: Theme;
  kind: 'text' | 'ui';
  fg: string;
  bg: string;
  ratio: number;
  need: number;
}

type Rgba = { rgb: [number, number, number]; a: number };

function parse(v: string): Rgba {
  const s = v.trim();
  let m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const h = m[1];
    return { rgb: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgba['rgb'], a: 1 };
  }
  m = s.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);
  if (m) return { rgb: [+m[1] / 255, +m[2] / 255, +m[3] / 255], a: m[4] === undefined ? 1 : +m[4] };
  throw new Error(`Koi palettes take #rrggbb or rgba() colors, got "${v}"`);
}

function format({ rgb, a }: Rgba): string {
  const b = rgb.map((x) => Math.round(x * 255));
  if (a >= 1) return '#' + b.map((x) => x.toString(16).padStart(2, '0')).join('');
  return `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${+a.toFixed(4)})`;
}

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = ([r, g, b]: Rgba['rgb']) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: Rgba['rgb'], b: Rgba['rgb']) => {
  const A = luminance(a), B = luminance(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
};
const over = (fg: Rgba, bg: Rgba['rgb']): Rgba['rgb'] => fg.rgb.map((x, i) => fg.a * x + (1 - fg.a) * bg[i]) as Rgba['rgb'];

const NEED = { text: 4.5, ui: 3 } as const;

export function createPaletteKit<Role extends string>(data: PaletteKitData<Role>) {
  const SWAP = /^(primary|accent)-(\d+)$/;

  function resolve(name: string, theme: Theme, palette: Palette, seen: string[]): string {
    const swap = name.match(SWAP);
    if (swap) return palette[swap[1] as keyof Palette][swap[2] as Shade];
    if (name in data.fixed) return data.fixed[name];
    const role = (data.roles as Record<string, Record<Theme, RoleValue>>)[name];
    if (!role) throw new Error(`Unknown color token "${name}"`);
    if (seen.includes(name)) throw new Error(`Reference cycle: ${[...seen, name].join(' -> ')}`);
    const v = role[theme];
    if (typeof v === 'string') return v;
    const base = resolve(v.ref, theme, palette, [...seen, name]);
    if (v.alpha === undefined) return base;
    const c = parse(base);
    return format({ rgb: c.rgb, a: c.a * v.alpha });
  }

  /** Every role token's color for `palette` in `theme` (hex or rgba), ready for StyleSheet or a Tamagui theme. */
  function createColors(palette: Palette, theme: Theme): Record<Role, string> {
    const out = {} as Record<Role, string>;
    for (const name of Object.keys(data.roles) as Role[]) out[name] = resolve(name, theme, palette, []);
    return out;
  }

  /**
   * The contrast pairs `palette` fails, in either theme: empty when it's safe to use. Built-in palettes always
   * pass (`pnpm contrast`); run this on a palette a user made before applying it.
   */
  function checkPalette(palette: Palette): ContrastFailure[] {
    const solid = (name: string, theme: Theme, ground: string): Rgba['rgb'] => {
      const c = parse(resolve(name, theme, palette, []));
      return c.a >= 1 ? c.rgb : over(c, solid(ground, theme, 'page-bg'));
    };
    const failures: ContrastFailure[] = [];
    for (const kind of ['text', 'ui'] as const)
      for (const [fg, bg, ground = 'page-bg'] of data.pairs[kind])
        for (const theme of ['light', 'dark'] as const) {
          const back = solid(bg, theme, ground);
          const c = parse(resolve(fg, theme, palette, []));
          const r = ratio(c.a >= 1 ? c.rgb : over(c, back), back);
          if (r < NEED[kind]) failures.push({ theme, kind, fg, bg, ratio: +r.toFixed(2), need: NEED[kind] });
        }
    return failures;
  }

  return { createColors, checkPalette };
}
