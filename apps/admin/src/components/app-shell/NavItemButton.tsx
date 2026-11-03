import { css } from '@tuuject/koi-react/styled-system/css';
import { Tooltip } from '@tuuject/koi-react/tooltip';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useNavigate } from '@tanstack/react-router';
import type { NavItem } from '../../nav';
import { focusRing } from './shared';

interface NavItemButtonProps {
  item: NavItem;
  active: boolean;
  /** Vertical sidebar only: the label is hidden and moves into a tooltip. */
  collapsed?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /** Sidebar: close the mobile drawer after navigating. */
  onNavigate?: () => void;
}

/**
 * One navigation destination, shared by the sidebar and the horizontal bar. Both layouts use the NavMenu
 * item rules (36px tall, 16px icon, radius-xl, nav-item-* fills); only the axis and alignment differ.
 */
export function NavItemButton({
  item,
  active,
  collapsed = false,
  orientation = 'vertical',
  onNavigate,
}: NavItemButtonProps) {
  const navigate = useNavigate();
  const button = (
    <button
      type="button"
      data-nav-item
      data-orientation={orientation}
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        height: 'control-md',
        paddingInline: '2',
        borderRadius: 'xl',
        color: 'nav-item-text',
        textStyle: 'body',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transitionProperty: 'background-color, color',
        transitionDuration: 'fast',
        _hover: { bg: 'nav-item-hover' },
        _focusVisible: focusRing,
        '&[data-orientation=horizontal]:focus-visible': { outlineOffset: '-2px' },
        '&[data-active=true]': { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
        '&[data-orientation=vertical]': { width: '100%', textAlign: 'left' },
        '&[data-orientation=horizontal]': { flexShrink: '0' },
      })}
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={() => {
        navigate({ to: item.to });
        onNavigate?.();
      }}
    >
      <item.icon size={sizes.icon} />
      <span data-nav-label>{item.title}</span>
    </button>
  );
  // Collapsed sidebar: the label moves into a tooltip. The horizontal bar always shows labels.
  return collapsed ? <Tooltip content={item.title}>{button}</Tooltip> : button;
}
