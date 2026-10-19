// Color helpers shared by build.mjs and contrast.mjs. No dependencies.
// Parses the formats used in tokens.json: #rrggbb, rgba(r, g, b, a), oklch(L% C H [/ a]).

const enc = (x) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const clamp = (x) => Math.max(0, Math.min(1, x));

export function oklchToSrgb(L, C, H) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((x) => clamp(enc(x)));
}

/** Returns { rgb: [r,g,b] in 0..1, a } or null if the string isn't a color. */
export function parseColor(v) {
  v = v.trim();
  let m = v.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const h = m[1];
    return { rgb: [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255), a: 1 };
  }
  m = v.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);
  if (m) {
    return { rgb: [m[1], m[2], m[3]].map((x) => +x / 255), a: m[4] === undefined ? 1 : +m[4] };
  }
  m = v.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/);
  if (m) {
    const L = m[2] ? +m[1] / 100 : +m[1];
    return { rgb: oklchToSrgb(L, +m[3], +m[4]), a: m[5] === undefined ? 1 : +m[5] };
  }
  return null;
}

/** Hex (#rrggbb) when opaque, rgba() otherwise. React Native understands both; it does not understand oklch(). */
export function toNativeColor(v) {
  const c = parseColor(v);
  if (!c) {
    throw new Error(`Unparseable color: ${v}`);
  }
  const b = c.rgb.map((x) => Math.round(x * 255));
  if (c.a >= 1) {
    return `#${b.map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  }
  return `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${+c.a.toFixed(3)})`;
}

/** The same color at `alpha` (times any alpha it already has). Keeps oklch() as oklch() so CSS-facing values stay exact. */
export function withAlpha(v, alpha) {
  const m = v.trim().match(/^oklch\(\s*([^/)]+?)\s*(?:\/\s*([\d.]+))?\s*\)$/);
  if (m) {
    return `oklch(${m[1]} / ${+(alpha * (m[2] === undefined ? 1 : +m[2])).toFixed(4)})`;
  }
  const c = parseColor(v);
  if (!c) {
    throw new Error(`Unparseable color: ${v}`);
  }
  const b = c.rgb.map((x) => Math.round(x * 255));
  return `rgba(${b[0]}, ${b[1]}, ${b[2]}, ${+(alpha * c.a).toFixed(4)})`;
}

export function luminance(rgb) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}

export function contrast(a, b) {
  const A = luminance(a),
    B = luminance(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
}

/** Composite a translucent color over an opaque ground. */
export function over(fg, bg) {
  return fg.rgb.map((x, i) => fg.a * x + (1 - fg.a) * bg.rgb[i]);
}
