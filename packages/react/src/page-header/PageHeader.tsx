import type { PageHeaderOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type PageHeaderSlot, pageHeader } from '@tuuject/koi-react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';
import type { SlotClassNames } from '../types.js';

export interface PageHeaderProps
  extends PageHeaderOwnProps,
    Omit<ComponentPropsWithRef<'header'>, keyof PageHeaderOwnProps | 'children' | 'title'> {
  classNames?: SlotClassNames<PageHeaderSlot>;
}

/**
 * A page's heading block: the h1 with an optional info mark beside it, an optional description, and page-level
 * actions on the right. The actions wrap under the title block when the header itself gets narrow.
 */
export function PageHeader({ title, description, actions, info, className, classNames, ...rest }: PageHeaderProps) {
  const s = pageHeader();
  return (
    <header {...rest} className={cx(s.root, className)}>
      <div className={cx(s.main, classNames?.main)}>
        <div className={cx(s.titleRow, classNames?.titleRow)}>
          <h1 className={cx(s.title, classNames?.title)}>{title}</h1>
          {info != null ? <span className={cx(s.info, classNames?.info)}>{info}</span> : null}
        </div>
        {description != null ? <p className={cx(s.description, classNames?.description)}>{description}</p> : null}
      </div>
      {actions != null ? <div className={cx(s.actions, classNames?.actions)}>{actions}</div> : null}
    </header>
  );
}
