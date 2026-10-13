// Loads src/tokens.json and resolves {references} per theme.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withAlpha } from './color.mjs';

export const SRC = fileURLToPath(new URL('../src/tokens.json', import.meta.url));
export const tokens = JSON.parse(readFileSync(SRC, 'utf8'));
export const THEMES = ['light', 'dark'];

export const colorTokens = tokens.color.tokens;
const byName = new Map(colorTokens.map((t) => [t.name, t]));

/** The raw value of a color token for a theme (may itself be a {reference}). */
export function rawValue(token, theme) {
  const v = token.value;
  return typeof v === 'object' ? v[theme] ?? v.light : v;
}

/** A reference to another color token, optionally at an alpha: {primary-700} or {primary-950 / 0.8}. */
export const REF_RE = /^\{([\w-]+)(?:\s*\/\s*([\d.]+))?\}$/;

/** Palettes swap the primary-* and accent-* scales (tokens.json `color.palettes`). */
export const palettes = tokens.color.palettes;
export const PALETTE_IDS = palettes.list.map((p) => p.id);
export const SWAP_RE = /^(primary|accent)-(\d+)$/;
const paletteById = new Map(palettes.list.map((p) => [p.id, p]));

/** Follows {references} until it reaches a literal color string, with `palette` supplying primary-* and accent-*. */
export function resolveColor(name, theme, palette = palettes.default, seen = []) {
  const p = paletteById.get(palette);
  if (!p) throw new Error(`Unknown palette "${palette}"`);
  const swap = name.match(SWAP_RE);
  if (swap && p[swap[1]]) return p[swap[1]][swap[2]];
  const t = byName.get(name);
  if (!t) throw new Error(`Unknown color token "${name}"${seen.length ? ` (via ${seen.join(' -> ')})` : ''}`);
  const v = rawValue(t, theme);
  const ref = v.match(REF_RE);
  if (!ref) return v;
  if (seen.includes(name)) throw new Error(`Reference cycle: ${[...seen, name].join(' -> ')}`);
  const base = resolveColor(ref[1], theme, palette, [...seen, name]);
  return ref[2] === undefined ? base : withAlpha(base, +ref[2]);
}

export const isThemed = (t) => typeof t.value === 'object';

/** Palette steps like primary-500 are core tokens; everything else is a role (semantic) token. */
export const SCALE_RE = /^(primary|accent|secondary|warning|error)-(50|100|200|300|400|500|600|700|800|900|950)$/;
