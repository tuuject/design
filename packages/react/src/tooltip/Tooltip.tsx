import * as React from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { tooltip } from '@koi/react/styled-system/recipes';

export type TooltipSide = 'top' | 'bottom';

export interface TooltipProps {
  /** A short phrase. Never essential information or interactive content. */
  content: React.ReactNode;
  /** One focusable element (a Button, IconButton, Link, <button>…). It receives the ref, handlers and aria-describedby. */
  children: React.ReactElement;
  /** Preferred side; flips to the other one when there's no room. Default top. */
  side?: TooltipSide;
  /** Force open or closed (controlled). */
  open?: boolean;
  /** Open on first render, then behave as usual. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: BaseTooltip.Root.ChangeEventDetails) => void;
  /** Milliseconds of hover before it opens. Default 0: it opens on hover, as in legacy. Keyboard focus always opens it at once. */
  delay?: number;
  /** Milliseconds before it closes after the pointer leaves. Default 0. */
  closeDelay?: number;
  /** Never open. */
  disabled?: boolean;
}

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
  content, children, side = 'top', open, defaultOpen, onOpenChange, delay = 0, closeDelay = 0, disabled,
}: TooltipProps) {
  const s = tooltip();
  const autoId = React.useId();
  const popupId = `${autoId}tooltip`;
  const child = React.Children.only(children) as React.ReactElement<ChildProps>;
  const triggerId = child.props.id ?? `${autoId}trigger`;

  // Base UI doesn't describe the trigger by the popup; the spec wants aria-describedby while it's shown.
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false);
  const shown = open ?? uncontrolledOpen;
  // Skip it when the tooltip only repeats the trigger's name (IconButton label="关闭" + content="关闭"), or it's read twice.
  const repeatsName = typeof content === 'string' && (child.props['aria-label'] === content || child.props.label === content);
  const describedBy = [child.props['aria-describedby'], shown && !repeatsName ? popupId : undefined].filter(Boolean).join(' ') || undefined;
  // title: undefined drops the native tooltip (IconButton sets one from its label), so the two don't stack.
  const trigger = React.cloneElement(child, { 'aria-describedby': describedBy, title: undefined });

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
        <BaseTooltip.Positioner side={side} sideOffset={8} className={s.positioner}>
          <BaseTooltip.Popup id={popupId} role="tooltip" className={s.popup}>
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
