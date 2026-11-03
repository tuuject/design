import { Collapsible } from '@base-ui/react/collapsible';
import { ChevronDownIcon } from '@tuuject/koi-react/icons';
import { css } from '@tuuject/koi-react/styled-system/css';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useState } from 'react';
import { type NavGroup, navContains } from '../../nav';
import { NavItemButton } from './NavItemButton';
import { navChevronClass, navItemClass } from './nav-item';

interface NavGroupItemProps {
  group: NavGroup;
  pathname: string;
  /** Sidebar: close the mobile drawer after a page is chosen. */
  onNavigate?: () => void;
}

/**
 * A group in the vertical sidebar: its own row toggles a Collapsible panel of the group's pages, expanded in
 * place. The panel animates on height, so it collapses without measuring anything; under reduced motion
 * global-css stops the transition.
 */
export function NavGroupItem({ group, pathname, onNavigate }: NavGroupItemProps) {
  const inPath = navContains(group, pathname);
  // Opens on mount when the group holds the current page, so a reload or a deep link lands with it expanded.
  const [open, setOpen] = useState(inPath);
  // Navigating into the group from somewhere else opens it too; the user can still collapse it afterwards.
  const [seenPath, setSeenPath] = useState(pathname);
  if (seenPath !== pathname) {
    setSeenPath(pathname);
    if (inPath) {
      setOpen(true);
    }
  }

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger
        className={navItemClass}
        data-nav-item
        data-orientation="vertical"
        data-in-path={inPath || undefined}
      >
        <group.icon size={sizes.icon} />
        <span data-nav-label>{group.title}</span>
        <span className={navChevronClass} data-nav-chevron>
          <ChevronDownIcon size={sizes['icon-sm']} />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Panel
        className={css({
          // The pages stack flush, like the groups: hover and active fills touch.
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: 'var(--collapsible-panel-height)',
          transition: 'height token(durations.fast) token(easings.out)',
          '&[data-starting-style], &[data-ending-style]': { height: '0' },
        })}
      >
        <ul className={css({ display: 'flex', flexDirection: 'column', margin: '0', padding: '0' })}>
          {group.children.map((child) => (
            <li key={child.to}>
              <NavItemButton item={child} active={pathname === child.to} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
