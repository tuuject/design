import type { BreadcrumbOwnProps } from '@tuuject/koi-core';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import { type BreadcrumbSlot, breadcrumb } from '@tuuject/koi-react/styled-system/recipes';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import type { ComponentPropsWithRef } from 'react';
import { ChevronRightIcon } from '../icons.js';
import { focusRingInside } from '../recipes/dimensions.js';
import { Link } from '../link/Link.js';
import { useStrings } from '../strings.js';
import type { SlotClassNames } from '../types.js';

export type { BreadcrumbItem } from '@tuuject/koi-core';

// The trail clips sideways to stay in the topbar, so the link's ring is drawn just inside it.
const crumbFocus = css({ _focusVisible: focusRingInside });

export interface BreadcrumbProps
  extends BreadcrumbOwnProps<Event>,
    Omit<ComponentPropsWithRef<'nav'>, keyof BreadcrumbOwnProps | 'children' | 'aria-label'> {
  classNames?: SlotClassNames<BreadcrumbSlot>;
}

/**
 * The trail to the current page, for a topbar: ancestors are plain Links, the current page is bold and carries
 * `aria-current="page"`, and chevrons separate them. Long trails ellipsize instead of overflowing.
 * Routing stays in the consumer: `onSelect` gets the click, so call `event.preventDefault()` and navigate.
 */
export function Breadcrumb({ items, label, className, classNames, ...rest }: BreadcrumbProps) {
  const t = useStrings();
  const s = breadcrumb();
  const current = breadcrumb({ current: true });

  return (
    <nav {...rest} aria-label={label || t.breadcrumb} className={cx(s.root, className)}>
      <ol className={cx(s.list, classNames?.list)}>
        {items.map((item, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: a trail has no ids and only changes as a whole on navigation.
          <li key={i} className={cx(s.item, item.current && current.item, classNames?.item)}>
            {i > 0 ? (
              <span className={cx(s.separator, classNames?.separator)} aria-hidden="true">
                <ChevronRightIcon size={sizes['icon-sm']} />
              </span>
            ) : null}
            {item.href !== undefined && !item.current ? (
              <Link
                href={item.href}
                variant="plain"
                className={cx(s.label, classNames?.label, crumbFocus)}
                onClick={(event) => {
                  // The DOM event, not React's synthetic one: a router wants to preventDefault the real anchor.
                  const domEvent = event.nativeEvent;
                  item.onSelect?.({ reason: 'link-press', event: domEvent, cancel: () => domEvent.preventDefault() });
                }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={item.current ? 'page' : undefined}
                className={cx(item.current ? current.label : s.label, classNames?.label)}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
