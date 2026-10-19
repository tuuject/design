export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarOwnProps {
  /** Image URL. While it loads, or if it fails, the initials show instead. */
  src?: string;
  /** Alt text and the source of the fallback initials (the first character for CJK names, otherwise up to two initials). */
  name?: string;
  /** sm 28px, md 36px (default), lg 44px, xl 64px. */
  size?: AvatarSize;
  /** circle (default) or square (12px corners). */
  shape?: AvatarShape;
}

/**
 * First character of a CJK name ("咕咕" → "咕"), else the first letters of the first and last words ("Ada Lovelace" → "AL").
 * A mixed name keeps only its leading initial ("Koi 管理员" → "K"): "K管" reads as neither script's initials.
 */
export function initials(name: string | undefined) {
  const s = (name ?? '').trim();
  if (!s) {
    return '?';
  }
  // Code points, not UTF-16 units, so a surrogate pair isn't cut in half.
  const first = (w: string | undefined) => (w ? Array.from(w)[0] : '');
  const isCjk = (ch: string) => /[㐀-鿿]/.test(ch);
  if (isCjk(first(s))) {
    return first(s);
  }
  const words = s.split(/\s+/);
  const last = words.length > 1 ? first(words[words.length - 1]) : '';
  return (first(words[0]) + (isCjk(last) ? '' : last)).toUpperCase();
}
