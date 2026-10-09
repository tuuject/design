import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { AlertDialog } from '@base-ui/react/alert-dialog';
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
  /**
   * 'alertdialog' for confirmations that need an answer (Base UI AlertDialog): a click outside never closes it,
   * and focus starts on the first footer button, the least destructive action (cancel). Default 'dialog'.
   */
  role?: 'dialog' | 'alertdialog';
  /** false: a click outside (on the backdrop) doesn't close it. Esc and the × still do. Default true; an alertdialog is never dismissed by a click outside. */
  dismissible?: boolean;
  /** Hide the × button (e.g. for confirmations that need an explicit answer). */
  hideClose?: boolean;
  className?: string;
}

/**
 * Modal dialog. Base UI handles the portal, focus trap, Esc, outside click, scroll lock and focus return.
 * AlertDialog differs from Dialog only in its Root (role, forced modal, no pointer dismissal); every other
 * part is the same component, so both variants share the parts and the recipe below.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size,
  role = 'dialog',
  dismissible = true,
  hideClose,
  className,
}: DialogProps) {
  const s = dialog({ size });
  const footerRef = React.useRef<HTMLDivElement>(null);
  const alert = role === 'alertdialog';
  // WAI-ARIA alertdialog: focus the least destructive action. The footer's first button is cancel by convention;
  // without an enabled one, fall back to Base UI's default (first tabbable element).
  const initialFocus = alert
    ? () => footerRef.current?.querySelector<HTMLElement>('button:not(:disabled), a[href]') ?? true
    : undefined;
  const handleOpenChange = (next: boolean) => onOpenChange(next);
  // When a click outside doesn't close the dialog, a mousedown on the empty area around the popup would still
  // blur the focused control and drop focus on <body> (Base UI only pulls it back on the next Tab). Keep it put.
  const keepFocus = alert || !dismissible
    ? (event: React.MouseEvent<HTMLDivElement>) => { if (event.target === event.currentTarget) event.preventDefault(); }
    : undefined;

  const portal = (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={s.backdrop} />
      <BaseDialog.Viewport className={s.viewport} onMouseDown={keepFocus}>
        <BaseDialog.Popup className={cx(s.popup, className)} initialFocus={initialFocus}>
          {title != null && <BaseDialog.Title className={s.title}>{title}</BaseDialog.Title>}
          {description != null && <BaseDialog.Description className={s.description}>{description}</BaseDialog.Description>}
          {children != null && <div className={s.body}>{children}</div>}
          {footer != null && (
            <ShapeProvider shape="rounded">
              <div ref={footerRef} className={s.footer}>{footer}</div>
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
  );

  return alert ? (
    <AlertDialog.Root open={open} onOpenChange={handleOpenChange}>
      {portal}
    </AlertDialog.Root>
  ) : (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange} disablePointerDismissal={!dismissible}>
      {portal}
    </BaseDialog.Root>
  );
}
