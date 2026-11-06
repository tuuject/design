import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { DrawerOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type DrawerSlot, drawer } from '@tuuject/koi-react/styled-system/recipes';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import type { MouseEvent } from 'react';
import { IconButton } from '../button/Button.js';
import { CloseIcon } from '../icons.js';
import { ShapeProvider } from '../shape.js';
import { useStrings } from '../strings.js';
import type { SlotClassNames } from '../types.js';

export interface DrawerProps extends DrawerOwnProps {
  /** Lands on the panel. */
  className?: string;
  classNames?: SlotClassNames<Exclude<DrawerSlot, 'popup'>>;
}

/**
 * A panel that slides in from an edge of the viewport, on the dialog's backdrop. Base UI's Dialog brings the
 * focus trap, Esc, scroll lock and focus return; only the geometry and the slide are Drawer's. Reach for Dialog
 * when the panel should sit in the middle of the screen.
 */
export function Drawer({
  open,
  onOpenChange,
  side = 'left',
  title,
  description,
  children,
  footer,
  label,
  hideTitle,
  dismissible = true,
  hideClose,
  className,
  classNames,
}: DrawerProps) {
  const s = drawer({ side, hideTitle });
  const t = useStrings();
  // When an outside click doesn't close the drawer, a mousedown on the empty viewport would still blur the
  // focused control; Dialog keeps focus put the same way.
  const keepFocus = !dismissible
    ? (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          event.preventDefault();
        }
      }
    : undefined;

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange} disablePointerDismissal={!dismissible}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={cx(s.backdrop, classNames?.backdrop)} />
        <BaseDialog.Viewport className={cx(s.viewport, classNames?.viewport)} onMouseDown={keepFocus}>
          <BaseDialog.Popup className={cx(s.popup, className)} aria-label={title == null ? label : undefined}>
            {title != null && <BaseDialog.Title className={cx(s.title, classNames?.title)}>{title}</BaseDialog.Title>}
            {description != null && (
              <BaseDialog.Description className={cx(s.description, classNames?.description)}>
                {description}
              </BaseDialog.Description>
            )}
            {children != null && <div className={cx(s.body, classNames?.body)}>{children}</div>}
            {footer != null && (
              <ShapeProvider shape="rounded">
                <div className={cx(s.footer, classNames?.footer)}>{footer}</div>
              </ShapeProvider>
            )}
            {!hideClose && (
              <BaseDialog.Close
                className={cx(s.close, classNames?.close)}
                render={
                  <IconButton label={t.close} icon={<CloseIcon size={sizes['icon-lg']} />} size="sm" shape="rounded" />
                }
              />
            )}
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
