import { css } from '@koi/react/styled-system/css';
import { Tooltip } from '@koi/react/tooltip';
import { sizes } from '@koi/tokens/dimensions';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { NAV_ITEMS } from '../../nav';
import { useUiStore } from '../../stores/ui';
import { focusRing, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './shared';

interface NavItemButtonProps {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}

function NavItemButton({ item, active, collapsed, onNavigate }: NavItemButtonProps) {
  const navigate = useNavigate();
  const button = (
    <button
      type="button"
      data-nav-item
      className={css({
        display: 'flex',
        alignItems: 'center',
        gap: '2',
        width: '100%',
        height: 'control-md',
        paddingInline: '2',
        borderRadius: 'xl',
        color: 'nav-item-text',
        textStyle: 'body',
        textAlign: 'left',
        cursor: 'pointer',
        transitionProperty: 'background-color, color',
        transitionDuration: 'fast',
        _hover: { bg: 'nav-item-hover' },
        _focusVisible: focusRing,
        '&[data-active=true]': { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
      })}
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={() => {
        navigate({ to: item.to });
        onNavigate();
      }}
    >
      <item.icon size={sizes.icon} />
      <span data-nav-label>{item.title}</span>
    </button>
  );
  // Collapsed sidebar: the label moves into a tooltip.
  return collapsed ? <Tooltip content={item.title}>{button}</Tooltip> : button;
}

export function Sidebar() {
  const collapsed = useUiStore((st) => st.sidebarCollapsed);
  const open = useUiStore((st) => st.mobileNavOpen);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  return (
    <aside
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        // Mobile: an off-canvas drawer. Desktop (md 768+): the shell's first flex column, pinned to
        // the viewport. Sticky rather than fixed so it keeps its width in the row and the collapse
        // animation still pushes the content over.
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 60,
        width: SIDEBAR_WIDTH,
        padding: '3',
        bg: 'surface',
        borderRightWidth: '1px',
        borderRightStyle: 'solid',
        borderRightColor: 'divider',
        transform: 'translateX(-100%)',
        transition: 'transform token(durations.spring) token(easings.spring)',
        '&[data-open=true]': { transform: 'translateX(0)' },
        md: {
          position: 'sticky',
          alignSelf: 'flex-start',
          height: '100dvh',
          transform: 'none',
          // Width collapse animates with a plain ease-out: the spring's overshoot makes the icons jitter.
          transition: 'width token(durations.fast) token(easings.out)',
          width: SIDEBAR_WIDTH,
          '&[data-collapsed=true]': {
            width: SIDEBAR_WIDTH_COLLAPSED,
            '& [data-nav-label], & [data-brand-text]': { display: 'none' },
            '& [data-nav-item]': { justifyContent: 'center', paddingInline: '0' },
          },
        },
      })}
      data-collapsed={collapsed}
      data-open={open}
    >
      <div className={css({ display: 'flex', alignItems: 'center', gap: '3', height: 'control-lg' })}>
        <span
          className={css({
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'control-lg',
            height: 'control-lg',
            borderRadius: 'xl',
            bg: 'secondary-solid',
            color: 'on-secondary-solid',
            textStyle: 'heading-3',
            fontWeight: 'bold',
          })}
        >
          K
        </span>
        <span className={css({ display: 'flex', flexDirection: 'column', gap: '0.125rem' })} data-brand-text>
          <span className={css({ textStyle: 'heading-3', fontWeight: 'bold', color: 'text' })}>Koi Admin</span>
          <span className={css({ textStyle: 'small', color: 'text-muted' })}>Koi 组件库演示</span>
        </span>
      </div>
      <nav
        aria-label="主导航"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          minH: '0',
        })}
      >
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
          })}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavItemButton
                item={item}
                active={pathname === item.to}
                collapsed={collapsed}
                onNavigate={() => setMobileNavOpen(false)}
              />
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
