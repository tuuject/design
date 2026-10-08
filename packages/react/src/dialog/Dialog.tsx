import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { dialog } from '@koi/react/styled-system/recipes';
import { cx } from '@koi/react/styled-system/css';
import { ShapeProvider } from '../shape';
import { IconButton } from '../button/Button';
import { CloseIcon } from '../icons';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Actions, in order: cancel (secondary ghost), then the confirming solid button. Buttons here default to shape="rounded". */
  footer?: React.ReactNode;
  /** sm 400 · md 520 · lg 720. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /** Hide the × button (e.g. for confirmations that need an explicit answer). */
  hideClose?: boolean;
  className?: string;
}

/**
 * Modal dialog. Base UI handles the portal, focus trap, Esc, outside click, scroll lock and focus return.
 * TODO (see docs/plan.md): role="alertdialog" variant via @base-ui/react/alert-dialog; a `dismissible={false}`
 * option (check Base UI's prop for disabling outside-click dismissal).
 */
export function Dialog({ open, onOpenChange, title, description, children, footer, size, hideClose, className }: DialogProps) {
  const s = dialog({ size });
  return (
    <BaseDialog.Root open={open} onOpenChange={(next: boolean) => onOpenChange(next)}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={s.backdrop} />
        <BaseDialog.Viewport className={s.viewport}>
          <BaseDialog.Popup className={cx(s.popup, className)}>
            {title != null && <BaseDialog.Title className={s.title}>{title}</BaseDialog.Title>}
            {description != null && <BaseDialog.Description className={s.description}>{description}</BaseDialog.Description>}
            {children != null && <div className={s.body}>{children}</div>}
            {footer != null && (
              <ShapeProvider shape="rounded">
                <div className={s.footer}>{footer}</div>
              </ShapeProvider>
            )}
            {!hideClose && (
              <BaseDialog.Close
                className={s.close}
                render={<IconButton label="关闭" icon={<CloseIcon size={18} />} size="sm" shape="rounded" />}
              />
            )}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
