import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { alert } from '@koi/react/styled-system/recipes';
import { CloseIcon, ErrorIcon, InfoIcon, WarningIcon } from '../icons';

export type AlertTone = 'info' | 'warning' | 'error';

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** info (sky) · warning (yellow) · error (red). Default info. */
  tone?: AlertTone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Replaces the tone icon; null hides it. */
  icon?: React.ReactNode | null;
  /** Usually a small Button, below the text. */
  action?: React.ReactNode;
  /** Shows a close button. */
  onClose?: () => void;
}

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
        <button type="button" className={s.close} aria-label="关闭" title="关闭" onClick={onClose}>
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
