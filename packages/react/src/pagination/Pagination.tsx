import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { pagination } from '@koi/react/styled-system/recipes';
import { Button } from '../button/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useButtonShape } from '../shape';

export type PaginationVariant = 'numbered' | 'simple';

export interface PaginationProps extends Omit<React.ComponentPropsWithRef<'nav'>, 'onChange' | 'children'> {
  /** The current page, 1-based. */
  page: number;
  pageCount: number;
  /** Called with the page to go to. Clicking the current page calls it too (as legacy). */
  onChange?: (page: number) => void;
  /** numbered (default): prev, page numbers, next. simple: the blog's two large pills around "n / m". */
  variant?: PaginationVariant;
  /** Default "上一页". */
  prevLabel?: string;
  /** Default "下一页". */
  nextLabel?: string;
  /** How many neighbours to show on each side of the current page. Default 1. */
  siblings?: number;
  /** The nav's accessible name. Default "分页". */
  label?: string;
}

const noop = () => {};

/**
 * Legacy's pageList, unchanged: the first and last page always, the current page with `sib` neighbours each side,
 * and a gap ("…a" before, "…b" after) wherever pages are left out, even if only one is.
 */
function pageList(page: number, count: number, sib: number): (number | '…a' | '…b')[] {
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

/** Page navigation: a <nav> with prev/next Buttons and either page numbers or "n / m". */
export function Pagination({
  page: pageProp, pageCount, onChange, variant, prevLabel, nextLabel, siblings, label, className, ...rest
}: PaginationProps) {
  // `|| 1` as legacy, so 0 or NaN fall back to one page / the first page.
  const count = pageCount || 1;
  const page = pageProp || 1;
  const go = onChange || noop;
  const simple = variant === 'simple';
  const shape = useButtonShape();
  const s = pagination({ shape });

  const prev = (
    <Button
      variant={simple ? 'solid' : 'soft'}
      size={simple ? 'lg' : 'md'}
      disabled={page <= 1}
      onClick={() => go(page - 1)}
      iconStart={simple ? undefined : <ChevronLeftIcon />}
    >
      {prevLabel || '上一页'}
    </Button>
  );
  const next = (
    <Button
      variant={simple ? 'solid' : 'soft'}
      size={simple ? 'lg' : 'md'}
      disabled={page >= count}
      onClick={() => go(page + 1)}
      iconEnd={simple ? undefined : <ChevronRightIcon />}
    >
      {nextLabel || '下一页'}
    </Button>
  );

  return (
    <nav aria-label={label || '分页'} {...rest} className={cx(s.root, className)}>
      {prev}
      {simple ? (
        <span className={s.count}>{`${page} / ${count}`}</span>
      ) : (
        <ol className={s.pages}>
          {pageList(page, count, siblings ?? 1).map((p) =>
            typeof p === 'string' ? (
              <li key={p} className={s.gap} aria-hidden="true">…</li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  className={s.page}
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={`第 ${p} 页`}
                  onClick={() => go(p)}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ol>
      )}
      {next}
    </nav>
  );
}
