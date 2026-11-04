import type { ChangeDetails } from '@tuuject/koi-react';
import type { NavItem, NavSection } from '@tuuject/koi-react/nav-menu';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useNavigate } from '@tanstack/react-router';
import { NAV_GROUPS } from '../../nav';

/**
 * `NAV_GROUPS` as NavMenu's items: each top-level category is a parent (`value` = its title) that opens its pages,
 * each page a leaf whose `href` is its typed route. Built once at module scope: the tree never changes at runtime.
 */
const SECTIONS: NavSection[] = [
  {
    items: NAV_GROUPS.map<NavItem>((group) => ({
      value: group.title,
      label: group.title,
      icon: <group.icon size={sizes.icon} />,
      children: group.children.map((child) => ({ value: child.to, label: child.title, href: child.to })),
    })),
  },
];

/**
 * The navigation's data and its click handler for all three surfaces (sidebar, drawer, top bar). A plain left click
 * becomes client routing; a modified click or another button falls through to the real `<a>`, so opening a page in a
 * new tab still works. `onNavigate` runs after a plain click only, which is how the mobile drawer closes itself.
 */
export function useNavMenu(onNavigate?: () => void) {
  const navigate = useNavigate();

  const onSelect = (_value: string, item: NavItem, details: ChangeDetails) => {
    const event = details.event as MouseEvent;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      // A new tab or a download is not a navigation in this app; keep the current row.
      details.cancel();
      return;
    }
    event.preventDefault();
    // Only pages are selectable (a parent only opens its children), so the value is always one of these routes.
    const to = NAV_GROUPS.flatMap((group) => group.children).find((child) => child.to === item.value)?.to;
    if (to === undefined) {
      return;
    }
    navigate({ to });
    onNavigate?.();
  };

  return { sections: SECTIONS, onSelect };
}
