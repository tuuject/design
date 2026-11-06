import { Popover as BasePopover } from '@base-ui/react/popover';
import type { FloatingPlacement, PopoverOwnProps } from '@tuuject/koi-core';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import { floatingPanel } from '@tuuject/koi-react/styled-system/recipes';
import { components } from '@tuuject/koi-tokens/dimensions';
import { useStrings } from '../strings.js';
import type { SlotClassNames } from '../types.js';

export type PopoverSlot = 'positioner' | 'body';

export interface PopoverProps extends PopoverOwnProps {
  /** Lands on the panel. */
  className?: string;
  classNames?: SlotClassNames<PopoverSlot>;
}

function placementOf(placement: FloatingPlacement) {
  const [side, align] = placement.split('-') as ['bottom' | 'top' | 'left' | 'right', 'start' | 'end'];
  return { side, align };
}

/**
 * A small panel of controls anchored to a trigger. Base UI supplies the behavior (focus, Esc, outside click,
 * flipping at the window edge); the panel is Menu's, so a popover and a menu read the same.
 */
export function Popover({
  trigger,
  children,
  placement = 'bottom-start',
  open,
  defaultOpen,
  onOpenChange,
  modal,
  label,
  className,
  classNames,
}: PopoverProps) {
  const s = floatingPanel({ content: 'panel' });
  const t = useStrings();
  const { side, align } = placementOf(placement);

  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <BasePopover.Trigger render={trigger} />
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={components.popup.offset}
          className={cx(s.positioner, classNames?.positioner)}
        >
          <BasePopover.Popup className={cx(s.popup, className)} aria-label={label}>
            <div className={cx(s.body, classNames?.body)}>{children}</div>
            {/* Base UI enables the focus trap only when a Close part exists; keep one in the tree but invisible. */}
            {modal && (
              <BasePopover.Close
                render={<button type="button" tabIndex={-1} aria-label={t.close} />}
                className={css({ srOnly: true })}
              />
            )}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
