import { Menu } from '@base-ui/react/menu';
import { ChevronDownIcon } from '@tuuject/koi-react/icons';
import { css } from '@tuuject/koi-react/styled-system/css';
import { components, sizes, space } from '@tuuject/koi-tokens/dimensions';
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
 * A group in the horizontal bar or the collapsed rail: its row opens a Menu panel of the group's pages. Base UI's
 * Menu is what the template already uses for the user menu and the change summary; it brings hover-open, arrow
 * keys, type-to-find, Esc, click-outside and flipping at the window edge, so the flyout needs no positioning code.
 */
export function NavFlyout({ group, pathname, side = 'bottom', collapsed = false }: NavFlyoutProps) {
  const navigate = useNavigate();
  const inPath = navContains(group, pathname);

  return (
    // Not modal: a modal menu locks page scroll, and a nav flyout has no reason to.
    <Menu.Root modal={false}>
      <Menu.Trigger
        openOnHover
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
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          // Portaled to <body>: without a layer the sticky header (z-index 40) paints over the panel's top edge.
          className={css({ zIndex: 'popup', outline: 'none' })}
          side={side}
          align="start"
          // The rail's row is inset by the sidebar's 12px padding; clearing it keeps the panel off the rail's edge.
          sideOffset={components.popup.offset + (side === 'right' ? space['3'] : 0)}
        >
          <Menu.Popup
            // SelectPanel's panel, the template's floating-list look (UserMenu, ChangeSummary).
            className={css({
              display: 'flex',
              flexDirection: 'column',
              minWidth: '200px',
              maxWidth: '280px',
              padding: '1',
              bg: 'surface',
              border: '1px solid {colors.border}',
              borderRadius: 'xl',
              boxShadow: 'float',
              outline: 'none',
              transformOrigin: 'var(--transform-origin)',
              transition:
                'opacity token(durations.fast) token(easings.out), transform token(durations.check) token(easings.spring)',
              '&[data-starting-style], &[data-ending-style]': { opacity: '0', transform: 'scale(.96)' },
            })}
          >
            {group.children.map((child) => {
              const active = child.to === pathname;
              return (
                <Menu.Item
                  key={child.to}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: 'control-md',
                    paddingInline: '3',
                    borderRadius: 'lg',
                    color: 'text',
                    textStyle: 'body',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    outline: 'none',
                    userSelect: 'none',
                    transitionProperty: 'background-color',
                    transitionDuration: 'fast',
                    '&[data-highlighted]': { bg: 'surface-muted' },
                    // The current page keeps the fill the bar gives its group, so the panel says where you are.
                    '&[aria-current=page]': { bg: 'nav-item-active', fontWeight: 'bold' },
                  })}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => navigate({ to: child.to })}
                >
                  {child.title}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
