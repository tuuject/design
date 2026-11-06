import type { EmptyOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type EmptySlot, empty } from '@tuuject/koi-react/styled-system/recipes';
import type { HTMLAttributes, ReactNode } from 'react';
import type { SlotClassNames } from '../types.js';

// React renders nothing for these, so the slot doesn't either: `action={canCreate && <Button />}` adds no gap.
// A 0 is real content and keeps its slot.
const filled = (node: ReactNode) => node != null && typeof node !== 'boolean' && node !== '';

export interface EmptyProps extends EmptyOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof EmptyOwnProps> {
  classNames?: SlotClassNames<EmptySlot>;
}

/**
 * A quiet placeholder for a page or panel with nothing to show: empty, failed, or not created yet. Keep the copy
 * concrete and put the way out in `action`. For a table's empty row, TableEmpty renders this with its own title.
 */
export function Empty({ icon, title, description, action, variant, className, classNames, ...rest }: EmptyProps) {
  const s = empty({ variant });
  return (
    <div {...rest} className={cx(s.root, className)}>
      {filled(icon) ? <span className={cx(s.icon, classNames?.icon)}>{icon}</span> : null}
      {/* Divs, not paragraphs: TableEmpty and DataTable's `empty` pass their own blocks through as the title. */}
      {filled(title) ? <div className={cx(s.title, classNames?.title)}>{title}</div> : null}
      {filled(description) ? <div className={cx(s.description, classNames?.description)}>{description}</div> : null}
      {filled(action) ? <div className={cx(s.action, classNames?.action)}>{action}</div> : null}
    </div>
  );
}
