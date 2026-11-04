import { ChevronDownIcon } from '@tuuject/koi-react/icons';
import { Menu } from '@tuuject/koi-react/menu';
import { css } from '@tuuject/koi-react/styled-system/css';
import { sizes, space } from '@tuuject/koi-tokens/dimensions';
import { useNavigate } from '@tanstack/react-router';
import { type NavGroup, navContains } from '../../nav';
import { navChevronClass, navItemClass } from './nav-item';

interface NavFlyoutProps {
  group: NavGroup;
  pathname: string;
  /** Below the horizontal bar, or beside a collapsed sidebar rail. */
  side?: 'bottom' | 'right';
  /** Collapsed rail: the label is hidden, so the trigger is named by aria-label instead. */
  collapsed?: boolean;
}

/**
 * A group in the horizontal bar or the collapsed rail: its row opens a Menu panel of the group's pages. Koi's
 * Menu brings hover-open, arrow keys, type-to-find, Esc, click-outside and flipping at the window edge, so the
 * flyout needs no positioning code of its own.
 */
export function NavFlyout({ group, pathname, side = 'bottom', collapsed = false }: NavFlyoutProps) {
  const navigate = useNavigate();
  const inPath = navContains(group, pathname);

  return (
    <Menu
      // Not modal: a modal menu locks page scroll, and a nav flyout has no reason to.
      modal={false}
      openOnHover
      placement={side === 'right' ? 'right-start' : 'bottom-start'}
      // The rail's row is inset by the sidebar's 12px padding; clearing it keeps the panel off the rail's edge.
      classNames={side === 'right' ? { positioner: css({ marginInlineStart: space['3'] }) } : undefined}
      // The panel is the NavMenu spec's flyout width, narrower than a menu's default 320px.
      className={css({ minWidth: '200px', maxWidth: '280px' })}
      trigger={
        <button
          type="button"
          className={navItemClass}
          data-nav-item
          data-orientation={side === 'right' ? 'vertical' : 'horizontal'}
          data-in-path={inPath || undefined}
          data-rail={collapsed || undefined}
          aria-label={collapsed ? group.title : undefined}
        >
          <group.icon size={sizes.icon} />
          <span data-nav-label>{group.title}</span>
          <span className={navChevronClass} data-nav-chevron>
            <ChevronDownIcon size={sizes['icon-sm']} />
          </span>
        </button>
      }
      items={group.children.map((child) => ({
        value: child.to,
        label: child.title,
        href: child.to,
        current: child.to === pathname,
      }))}
      onSelect={(value, _item, details) => {
        // A real anchor for middle-click, modifier-click and copy-link; only a plain click becomes client routing.
        const event = details.event as MouseEvent;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
          return;
        }
        event.preventDefault();
        const leaf = group.children.find((child) => child.to === value);
        if (leaf) {
          navigate({ to: leaf.to });
        }
      }}
    />
  );
}
