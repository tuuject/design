import { Collapsible } from '@base-ui/react/collapsible';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { type NavItem, type NavMenuOwnProps, type NavSection, navPath } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { floatingPanel, type NavMenuSlot, navMenu } from '@tuuject/koi-react/styled-system/recipes';
import { components, sizes, space } from '@tuuject/koi-tokens/dimensions';
import { Fragment, type MouseEvent, type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '../icons.js';
import { useStrings } from '../strings.js';
import type { ChangeDetails, SlotClassNames } from '../types.js';

export type { NavItem, NavMenuBrand, NavMenuOwnProps, NavSection } from '@tuuject/koi-core';

export interface NavMenuProps extends NavMenuOwnProps<Event> {
  /** Lands on the root `<nav>`. */
  className?: string;
  classNames?: SlotClassNames<NavMenuSlot>;
}

type Chevron = 'none' | 'down' | 'right';

/**
 * The app's navigation, as a vertical sidebar or a horizontal bar, from the same items (docs/spec/components/NavMenu.md).
 * Vertical parents expand in place with Base UI's Collapsible; horizontal and rail parents open a Menu panel
 * (level-2 parents cascade a second one to the right), so hover, arrow keys, Esc, outside click and flipping at the
 * window edge come from Base UI. The nav has no background of its own: place it on `page-bg` or `surface`.
 */
export function NavMenu({
  orientation = 'vertical',
  sections,
  items,
  value,
  defaultValue,
  onSelect,
  defaultExpanded,
  brand,
  footer,
  label,
  current = 'page',
  collapsed = false,
  className,
  classNames,
}: NavMenuProps) {
  const t = useStrings();
  const s = navMenu({ orientation, collapsed: orientation === 'vertical' && collapsed });
  // Flyout rows are portaled out of the nav, but the class still carries the bar's variant: a row in a panel is
  // always a full-width column row with its label, whatever the bar's orientation or the rail's state.
  const panelS = navMenu({});
  const fp = floatingPanel();
  const baseId = useId();

  // Controlled or not, the same way Base UI's own components do it: an undefined `value` leaves the state here.
  const [innerValue, setInnerValue] = useState(defaultValue);
  const selected = value ?? innerValue;

  const groups: NavSection[] = sections ?? (items === undefined ? [] : [{ items }]);
  // Sections don't nest, so one flat list is enough to find the current item's trail through the tree.
  const path = navPath(
    groups.flatMap((group) => group.items),
    selected,
  );
  // The parents of the current page, which open themselves and read as the way back.
  const ancestors = path.slice(0, -1);

  const [expanded, setExpanded] = useState<string[]>(() => [...(defaultExpanded ?? []), ...ancestors]);
  // Moving into another branch opens it, and so does the current item's branch arriving after the value (items
  // loaded later). A manual collapse of the current branch stays collapsed until the trail changes, because only
  // a trail change lands here.
  const trail = JSON.stringify(path);
  const [seenTrail, setSeenTrail] = useState(trail);
  if (seenTrail !== trail) {
    setSeenTrail(trail);
    setExpanded((open) => [...new Set([...open, ...ancestors])]);
  }

  const toggle = (value: string, open: boolean) =>
    setExpanded((prev) => (open ? [...new Set([...prev, value])] : prev.filter((v) => v !== value)));

  // Horizontal and rail menus: one panel at a time, and it closes when the bar it hangs from moves away or the
  // window resizes.
  const navRef = useRef<HTMLElement>(null);
  const [openFlyout, setOpenFlyout] = useState<string | null>(null);
  useEffect(() => {
    if (openFlyout === null) {
      return;
    }
    const nav = navRef.current;
    const pinnedAt = nav?.getBoundingClientRect() ?? null;
    const close = () => setOpenFlyout(null);
    // Scroll events don't bubble, so this listens while capturing. A scroll inside the bar moves its rows, and a
    // scroll of an ancestor moves the bar itself: either one leaves the panel behind. The page scrolling under a
    // sticky or fixed bar moves neither, and the panel follows its parent through it (Base UI tracks the anchor on
    // scroll), so only a bar that actually moved counts. A scroll anywhere else, such as the open panel's own list,
    // leaves the panel in place.
    const closeOnScroll = (event: Event) => {
      const target = event.target;
      if (nav === null || !(target instanceof Node) || !(nav.contains(target) || target.contains(nav))) {
        return;
      }
      if (pinnedAt === null || nav.contains(target)) {
        close();
        return;
      }
      const moved = nav.getBoundingClientRect();
      if (Math.abs(moved.x - pinnedAt.x) > 0.5 || Math.abs(moved.y - pinnedAt.y) > 0.5) {
        close();
      }
    };
    window.addEventListener('scroll', closeOnScroll, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', closeOnScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [openFlyout]);

  // The consumer's handler runs first: it can preventDefault to route on the client, or cancel to keep the value.
  const choose = (item: NavItem, event: Event) => {
    let canceled = false;
    const details: ChangeDetails = {
      reason: 'item-press',
      event,
      cancel: () => {
        canceled = true;
      },
    };
    onSelect?.(item.value, item, details);
    if (!canceled && value === undefined) {
      setInnerValue(item.value);
    }
    return canceled;
  };

  const content = (slots: typeof s, item: NavItem, level: number, chevron: Chevron) => (
    <>
      {level === 0 && item.icon != null && (
        <span className={cx(slots.itemIcon, classNames?.itemIcon)}>{item.icon}</span>
      )}
      <span className={cx(slots.itemLabel, classNames?.itemLabel)}>{item.label}</span>
      {(item.badge != null || chevron !== 'none') && (
        <span className={cx(slots.trailing, classNames?.trailing)}>
          {item.badge != null && <span className={cx(slots.badge, classNames?.badge)}>{item.badge}</span>}
          {chevron === 'down' && (
            <span className={cx(slots.chevron, classNames?.chevron)}>
              <ChevronDownIcon size={sizes['icon-sm']} />
            </span>
          )}
          {chevron === 'right' && (
            <span className={cx(slots.submenuChevron, classNames?.submenuChevron)}>
              <ChevronRightIcon size={sizes['icon-sm']} />
            </span>
          )}
        </span>
      )}
    </>
  );

  /** A row that goes somewhere: a real link with an href, an inert disabled button without one. */
  const leaf = (item: NavItem, level: number) => {
    const active = item.value === selected;
    const className = cx(s.item, level === 1 && s.level2, level === 2 && s.level3, classNames?.item);
    const body = content(s, item, level, 'none');
    return item.href !== undefined && !item.disabled ? (
      <a
        href={item.href}
        className={className}
        aria-current={active ? current : undefined}
        onClick={(event) => choose(item, event.nativeEvent)}
      >
        {body}
      </a>
    ) : (
      <button
        type="button"
        className={className}
        disabled={item.disabled}
        aria-current={active ? current : undefined}
        onClick={(event) => choose(item, event.nativeEvent)}
      >
        {body}
      </button>
    );
  };

  /** One row of a flyout panel: a Menu row, because a Menu owns the highlight, the keyboard and the closing. */
  const menuLeaf = (item: NavItem) => {
    const active = item.value === selected;
    const body = content(panelS, item, 0, 'none');
    const shared = {
      className: cx(panelS.item, panelS.panelItem, classNames?.item),
      'aria-current': active ? current : undefined,
      closeOnClick: false,
      onClick: (event: MouseEvent) => {
        if (!choose(item, event.nativeEvent)) {
          setOpenFlyout(null);
        }
      },
    };
    // A disabled row is not a link: LinkItem has no disabled state, so an inert Item stands in for it.
    return item.href !== undefined && !item.disabled ? (
      <BaseMenu.LinkItem key={item.value} href={item.href} {...shared}>
        {body}
      </BaseMenu.LinkItem>
    ) : (
      <BaseMenu.Item key={item.value} disabled={item.disabled} {...shared}>
        {body}
      </BaseMenu.Item>
    );
  };

  /** A level-2 parent inside a panel: its own row opens a second panel beside the first. */
  const submenu = (item: NavItem) => {
    const inPath = ancestors.includes(item.value);
    return (
      <BaseMenu.SubmenuRoot key={item.value}>
        <BaseMenu.SubmenuTrigger
          className={cx(panelS.item, panelS.panelItem, inPath && panelS.onPath, classNames?.item)}
          disabled={item.disabled}
        >
          {content(panelS, item, 0, 'right')}
        </BaseMenu.SubmenuTrigger>
        <BaseMenu.Portal>
          <BaseMenu.Positioner
            side="right"
            align="start"
            sideOffset={components.popup.offset}
            className={fp.positioner}
          >
            <BaseMenu.Popup className={cx(fp.popup, panelS.panel, classNames?.panel)}>
              <div className={cx(fp.body, panelS.panelList, classNames?.panelList)}>
                {item.children?.map((child) => menuLeaf(child))}
              </div>
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.SubmenuRoot>
    );
  };

  /** A parent in the horizontal bar or the rail: its row opens a Menu panel of its pages. */
  const flyout = (item: NavItem, side: 'bottom' | 'right', rail: boolean) => {
    const inPath = ancestors.includes(item.value);
    return (
      <BaseMenu.Root
        modal={false}
        open={openFlyout === item.value}
        onOpenChange={(open) => setOpenFlyout(open ? item.value : null)}
      >
        <BaseMenu.Trigger
          className={cx(s.item, inPath && s.onPath, classNames?.item)}
          openOnHover
          disabled={item.disabled}
          aria-current={item.value === selected ? current : undefined}
        >
          {content(s, item, 0, rail ? 'none' : 'down')}
        </BaseMenu.Trigger>
        <BaseMenu.Portal>
          <BaseMenu.Positioner
            side={side}
            align="start"
            // Beside the rail, the panel clears the nav's own 12px inset before the usual 4px gap.
            sideOffset={side === 'right' ? components.popup.offset + space['3'] : components.popup.offset}
            className={fp.positioner}
          >
            <BaseMenu.Popup className={cx(fp.popup, panelS.panel, classNames?.panel)}>
              <div className={cx(fp.body, panelS.panelList, classNames?.panelList)}>
                {item.children?.map((child) => (child.children?.length ? submenu(child) : menuLeaf(child)))}
              </div>
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    );
  };

  const renderItem = (item: NavItem, level: number): ReactNode => {
    const inPath = ancestors.includes(item.value);
    if (orientation === 'horizontal') {
      return <li key={item.value}>{item.children?.length ? flyout(item, 'bottom', false) : leaf(item, 0)}</li>;
    }
    if (collapsed) {
      // A 72px rail has no room for an expanded tree: every parent opens its pages beside it instead.
      return <li key={item.value}>{item.children?.length ? flyout(item, 'right', true) : leaf(item, 0)}</li>;
    }
    // Three levels at most: a level-3 item's own children are ignored, so it renders as a row.
    if (level < 2 && item.children?.length) {
      return (
        <li key={item.value}>
          <Collapsible.Root
            open={expanded.includes(item.value)}
            onOpenChange={(open) => toggle(item.value, open)}
            disabled={item.disabled}
          >
            <Collapsible.Trigger className={cx(s.item, level === 1 && s.level2, inPath && s.onPath, classNames?.item)}>
              {content(s, item, level, 'down')}
            </Collapsible.Trigger>
            <Collapsible.Panel className={cx(s.collapse, classNames?.collapse)}>
              <ul className={cx(s.list, classNames?.list)}>
                {item.children.map((child) => renderItem(child, level + 1))}
              </ul>
            </Collapsible.Panel>
          </Collapsible.Root>
        </li>
      );
    }
    return <li key={item.value}>{leaf(item, level)}</li>;
  };

  const brandInner = brand && (
    <>
      {brand.logo != null && (
        <span className={cx(s.brandLogo, classNames?.brandLogo)} aria-hidden="true">
          {brand.logo}
        </span>
      )}
      <span className={cx(s.brandText, classNames?.brandText)}>
        <span className={cx(s.brandTitle, classNames?.brandTitle)}>{brand.title}</span>
        {brand.subtitle != null && (
          <span className={cx(s.brandSubtitle, classNames?.brandSubtitle)}>{brand.subtitle}</span>
        )}
      </span>
    </>
  );

  const brandNode =
    brand === undefined ? null : brand.href !== undefined ? (
      <a href={brand.href} className={cx(s.brand, classNames?.brand)}>
        {brandInner}
      </a>
    ) : (
      <div className={cx(s.brand, classNames?.brand)}>{brandInner}</div>
    );

  return (
    <nav ref={navRef} className={cx(s.root, className)} aria-label={label ?? t.navMenu}>
      {brandNode}
      <div className={cx(s.body, classNames?.body)}>
        {groups.map((group, index) => {
          const labelId = `${baseId}-s${index}`;
          return (
            <Fragment key={labelId}>
              {/* One row in the bar: a line, not a label, separates the groups. */}
              {orientation === 'horizontal' && index > 0 && (
                <span className={cx(s.divider, classNames?.divider)} aria-hidden="true" />
              )}
              <div className={cx(s.section, classNames?.section)}>
                {group.label != null && (
                  <div id={labelId} className={cx(s.sectionLabel, classNames?.sectionLabel)}>
                    {group.label}
                  </div>
                )}
                <ul
                  className={cx(s.list, classNames?.list)}
                  aria-labelledby={group.label != null ? labelId : undefined}
                >
                  {group.items.map((item) => renderItem(item, 0))}
                </ul>
              </div>
            </Fragment>
          );
        })}
      </div>
      {footer != null && <div className={cx(s.footer, classNames?.footer)}>{footer}</div>}
    </nav>
  );
}
