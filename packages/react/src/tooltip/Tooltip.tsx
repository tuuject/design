import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { TooltipOwnProps } from '@koi/core';
import { tooltip } from '@koi/react/styled-system/recipes';
import { components } from '@koi/tokens/dimensions';
import { type ReactElement, Children, cloneElement, useId, useState } from 'react';

export type { TooltipSide } from '@koi/core';

export interface TooltipProps extends TooltipOwnProps<Event> {}

type ChildProps = {
  id?: string;
  label?: unknown;
  title?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
};

/**
 * Inverted bubble naming or explaining its child, on hover and keyboard focus. Base UI handles the delays, focus,
 * Esc, the portal and positioning (8px from the trigger, flipping near the viewport edge).
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  open,
  defaultOpen,
  onOpenChange,
  delay = 0,
  closeDelay = 0,
  disabled,
}: TooltipProps) {
  const s = tooltip();
  const autoId = useId();
  const popupId = `${autoId}tooltip`;
  const child = Children.only(children) as ReactElement<ChildProps>;
  const triggerId = child.props.id ?? `${autoId}trigger`;

  // Base UI doesn't describe the trigger by the popup; the spec wants aria-describedby while it's shown.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const shown = open ?? uncontrolledOpen;
  // Skip it when the tooltip only repeats the trigger's name (IconButton label="关闭" + content="关闭"), or it's read twice.
  const repeatsName =
    typeof content === 'string' && (child.props['aria-label'] === content || child.props.label === content);
  const describedBy =
    [child.props['aria-describedby'], shown && !repeatsName ? popupId : undefined].filter(Boolean).join(' ') ||
    undefined;
  // title: undefined drops the native tooltip (IconButton sets one from its label), so the two don't stack.
  const trigger = cloneElement(child, { 'aria-describedby': describedBy, title: undefined });

  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      triggerId={open === undefined ? undefined : triggerId}
      defaultTriggerId={defaultOpen ? triggerId : undefined}
      disabled={disabled}
      onOpenChange={(next, details) => {
        setUncontrolledOpen(next);
        onOpenChange?.(next, details);
      }}
    >
      <BaseTooltip.Trigger id={triggerId} delay={delay} closeDelay={closeDelay} render={trigger} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={components.tooltip.offset} className={s.positioner}>
          <BaseTooltip.Popup id={popupId} role="tooltip" className={s.popup}>
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
