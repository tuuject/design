import { type AlertOwnProps, strings } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { alert } from '@koi/react/styled-system/recipes';
import type { HTMLAttributes } from 'react';
import { CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '../icons';

export type { AlertTone } from '@koi/core';

export interface AlertProps extends AlertOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof AlertOwnProps> {}

const toneIcon = { info: InfoIcon, warning: WarningIcon, error: ErrorIcon };

/**
 * An inline message that belongs to the page or a section. Warning and error are role="alert", info is role="status".
 * For brief confirmations that disappear on their own, use Toast.
 */
export function Alert({ tone = 'info', title, icon, action, onClose, className, children, ...rest }: AlertProps) {
  const s = alert({ tone, closable: !!onClose });
  const Icon = toneIcon[tone] ?? InfoIcon;
  const shownIcon = icon !== undefined ? icon : <Icon />;
  return (
    <div role={tone === 'info' ? 'status' : 'alert'} {...rest} className={cx(s.root, className)}>
      {shownIcon ? <span className={s.icon}>{shownIcon}</span> : null}
      <div className={s.content}>
        {title ? <p className={s.title}>{title}</p> : null}
        {children ? <div className={s.body}>{children}</div> : null}
        {action ? <div className={s.action}>{action}</div> : null}
      </div>
      {onClose ? (
        <button type="button" className={s.close} aria-label={strings.close} title={strings.close} onClick={onClose}>
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
