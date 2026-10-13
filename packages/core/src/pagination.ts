export type PaginationVariant = 'numbered' | 'simple';

export interface PaginationOwnProps {
  /** The current page, 1-based. */
  page: number;
  pageCount: number;
  /** Called with the page to go to. Choosing the current page calls it too (as legacy). */
  onChange?: (page: number) => void;
  /** numbered (default): prev, page numbers, next. simple: the blog's two large pills around "n / m". */
  variant?: PaginationVariant;
  /** Default "上一页". */
  prevLabel?: string;
  /** Default "下一页". */
  nextLabel?: string;
  /** How many neighbours to show on each side of the current page. Default 1. */
  siblings?: number;
  /** The navigation's accessible name. Default "分页". */
  label?: string;
}

/**
 * Legacy's pageList, unchanged: the first and last page always, the current page with `sib` neighbours each side,
 * and a gap ("…a" before, "…b" after) wherever pages are left out, even if only one is.
 */
export function pageList(page: number, count: number, sib: number): (number | '…a' | '…b')[] {
  const out: (number | '…a' | '…b')[] = [];
  const lo = Math.max(2, page - sib);
  const hi = Math.min(count - 1, page + sib);
  out.push(1);
  if (lo > 2) out.push('…a');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < count - 1) out.push('…b');
  if (count > 1) out.push(count);
  return out;
}
