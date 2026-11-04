import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { FloatingPlacement, MenuGroupOwnProps, MenuItemOwnProps, MenuOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type FloatingPanelSlot, floatingPanel } from '@tuuject/koi-react/styled-system/recipes';
import { components } from '@tuuject/koi-tokens/dimensions';
import { type MouseEvent, type ReactNode, useRef } from 'react';
import type { ChangeDetails, SlotClassNames } from '../types.js';

export interface MenuProps extends MenuOwnProps<Event> {
  /** Lands on the panel. */
  className?: string;
  classNames?: SlotClassNames<Exclude<FloatingPanelSlot, 'popup'>>;
  /**
   * Where focus goes when the menu closes. Base UI's default (the trigger, or what had focus before) covers most
   * menus; a menu that jumps somewhere else in the page returns the element to focus instead.
   */
  // biome-ignore lint/suspicious/noConfusingVoidType: a handler that returns nothing must stay allowed; `undefined` would reject it.
  finalFocus?: (interactionType: 'mouse' | 'touch' | 'pen' | 'keyboard' | '') => HTMLElement | boolean | null | void;
}

/** Koi's placements are Base UI's side plus align, spelled out so no library type leaks into the props. */
function placementOf(placement: FloatingPlacement) {
  const [side, align] = placement.split('-') as ['bottom' | 'top' | 'left' | 'right', 'start' | 'end'];
  return { side, align };
}

const isGroup = <E,>(entry: MenuItemOwnProps<E> | MenuGroupOwnProps<E> | 'separator'): entry is MenuGroupOwnProps<E> =>
  typeof entry === 'object' && Array.isArray((entry as MenuGroupOwnProps<E>).items);

/**
 * A dropdown list of actions or links. Base UI supplies the behavior (arrow keys, type-to-find, Esc, outside
 * click, flipping at the window edge); the panel is the one Popover uses, so both read the same.
 */
export function Menu({
  trigger,
  items,
  header,
  footer,
  placement = 'bottom-start',
  openOnHover,
  modal,
  open,
  defaultOpen,
  onOpenChange,
  onSelect,
  className,
  classNames,
  finalFocus,
}: MenuProps) {
  const s = floatingPanel();
  // `close()` runs after the handler, not on the click itself: an item can cancel, and a LinkItem's default
  // action (client routing) has to see the click first.
  const actions = useRef<{ unmount(): void; close(): void } | null>(null);
  const { side, align } = placementOf(placement);

  const choose = (item: MenuItemOwnProps<Event>, event: MouseEvent) => {
    let canceled = false;
    const details: ChangeDetails = {
      reason: 'item-press',
      event: event.nativeEvent,
      cancel: () => {
        canceled = true;
      },
    };
    (item.onSelect ?? onSelect)?.(item.value, item, details);
    if (!canceled) {
      actions.current?.close();
    }
  };

  const row = (item: MenuItemOwnProps<Event>) => {
    const content = (
      <>
        {item.icon != null && <span className={cx(s.itemIcon, classNames?.itemIcon)}>{item.icon}</span>}
        <span className={cx(s.itemText, classNames?.itemText)}>{item.label}</span>
        {item.endContent != null && <span className={cx(s.itemEnd, classNames?.itemEnd)}>{item.endContent}</span>}
      </>
    );
    const shared = {
      className: cx(s.item, classNames?.item),
      label: item.textValue,
      closeOnClick: false,
      'aria-current': item.current ? ('page' as const) : undefined,
    };
    // A disabled row is not a link: Base UI's LinkItem has no disabled state, so render an inert Item instead.
    return item.href != null && !item.disabled ? (
      <BaseMenu.LinkItem key={item.value} {...shared} href={item.href} onClick={(event) => choose(item, event)}>
        {content}
      </BaseMenu.LinkItem>
    ) : (
      <BaseMenu.Item key={item.value} {...shared} disabled={item.disabled} onClick={(event) => choose(item, event)}>
        {content}
      </BaseMenu.Item>
    );
  };

  const entry = (e: MenuItemOwnProps<Event> | MenuGroupOwnProps<Event> | 'separator', index: number): ReactNode => {
    if (e === 'separator') {
      return <BaseMenu.Separator key={`separator-${index}`} className={cx(s.separator, classNames?.separator)} />;
    }
    if (isGroup(e)) {
      return (
        <BaseMenu.Group key={`group-${index}`} className={cx(s.group, classNames?.group)}>
          {e.label != null && (
            <BaseMenu.GroupLabel className={cx(s.groupLabel, classNames?.groupLabel)}>{e.label}</BaseMenu.GroupLabel>
          )}
          {e.items.map(row)}
        </BaseMenu.Group>
      );
    }
    return row(e);
  };

  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal} actionsRef={actions}>
      <BaseMenu.Trigger render={trigger} openOnHover={openOnHover} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={side}
          align={align}
          sideOffset={components.popup.offset}
          className={cx(s.positioner, classNames?.positioner)}
        >
          <BaseMenu.Popup className={cx(s.popup, className)} finalFocus={finalFocus}>
            {header != null && <div className={cx(s.header, classNames?.header)}>{header}</div>}
            <div className={cx(s.body, classNames?.body)}>{items.map(entry)}</div>
            {footer != null && <div className={cx(s.footer, classNames?.footer)}>{footer}</div>}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
