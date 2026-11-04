import type { EmptyOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type EmptySlot, empty } from '@tuuject/koi-react/styled-system/recipes';
import type { HTMLAttributes } from 'react';
import type { SlotClassNames } from '../types.js';

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
      {icon ? <span className={cx(s.icon, classNames?.icon)}>{icon}</span> : null}
      {title ? <p className={cx(s.title, classNames?.title)}>{title}</p> : null}
      {description ? <p className={cx(s.description, classNames?.description)}>{description}</p> : null}
      {action ? <div className={cx(s.action, classNames?.action)}>{action}</div> : null}
    </div>
  );
}
