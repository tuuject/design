// Loads src/tokens.json and resolves {references} per theme.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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

/** Follows {references} until it reaches a literal color string. */
export function resolveColor(name, theme, seen = []) {
  const t = byName.get(name);
  if (!t) throw new Error(`Unknown color token "${name}"${seen.length ? ` (via ${seen.join(' -> ')})` : ''}`);
  const v = rawValue(t, theme);
  const ref = v.match(/^\{(.+)\}$/);
  if (!ref) return v;
  if (seen.includes(name)) throw new Error(`Reference cycle: ${[...seen, name].join(' -> ')}`);
  return resolveColor(ref[1], theme, [...seen, name]);
}

export const isThemed = (t) => typeof t.value === 'object';

/** Palette steps like primary-500 are core tokens; everything else is a role (semantic) token. */
export const SCALE_RE = /^(primary|accent|secondary|warning|error)-(50|100|200|300|400|500|600|700|800|900|950)$/;
