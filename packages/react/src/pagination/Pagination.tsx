import { type PaginationOwnProps, pageList, strings } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { pagination } from '@koi/react/styled-system/recipes';
import type * as React from 'react';
import { Button } from '../button/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { useButtonShape } from '../shape';

export type { PaginationVariant } from '@koi/core';

export interface PaginationProps
  extends PaginationOwnProps,
    Omit<React.ComponentPropsWithRef<'nav'>, keyof PaginationOwnProps | 'children'> {}

const noop = () => {};

/** Page navigation: a <nav> with prev/next Buttons and either page numbers or "n / m". */
export function Pagination({
  page: pageProp,
  pageCount,
  onChange,
  variant,
  prevLabel,
  nextLabel,
  siblings,
  label,
  className,
  ...rest
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
      {prevLabel || strings.prevPage}
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
      {nextLabel || strings.nextPage}
    </Button>
  );

  return (
    <nav aria-label={label || strings.pagination} {...rest} className={cx(s.root, className)}>
      {prev}
      {simple ? (
        <span className={s.count}>{`${page} / ${count}`}</span>
      ) : (
        <ol className={s.pages}>
          {pageList(page, count, siblings ?? 1).map((p) =>
            typeof p === 'string' ? (
              <li key={p} className={s.gap} aria-hidden="true">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  className={s.page}
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={strings.page(p)}
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
