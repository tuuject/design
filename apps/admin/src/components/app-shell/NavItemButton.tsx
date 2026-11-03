import { cx } from '@tuuject/koi-react/styled-system/css';
import { useNavigate } from '@tanstack/react-router';
import type { NavLeaf } from '../../nav';
import { navChildClass, navItemClass } from './nav-item';

interface NavItemButtonProps {
  item: NavLeaf;
  active: boolean;
  /** Sidebar: close the mobile drawer after navigating. */
  onNavigate?: () => void;
}

/**
 * One page inside a group's panel. Every leaf is a level-2 row: no icon, indented to where the group's label
 * starts, per NavMenu's child rule.
 */
export function NavItemButton({ item, active, onNavigate }: NavItemButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={cx(navItemClass, navChildClass)}
      data-nav-item
      data-orientation="vertical"
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={() => {
        navigate({ to: item.to });
        onNavigate?.();
      }}
    >
      <span data-nav-label>{item.title}</span>
    </button>
  );
}
