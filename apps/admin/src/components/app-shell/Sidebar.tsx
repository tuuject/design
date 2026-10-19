import { css } from '@koi/react/styled-system/css';
import { sizes } from '@koi/tokens/dimensions';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { NAV_ITEMS } from '../../nav';
import { useUiStore } from '../../stores/ui';
import { Tooltip } from '@koi/react/tooltip';
import { focusRing, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './shared';

const s = {
  root: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '6',
    // Mobile: an off-canvas drawer. Desktop (md 768+): the first grid column of the shell.
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
      position: 'static',
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
  }),
  brand: css({ display: 'flex', alignItems: 'center', gap: '3', height: 'control-lg' }),
  logo: css({
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
  }),
  brandText: css({ display: 'flex', flexDirection: 'column', gap: '0.125rem' }),
  brandTitle: css({ textStyle: 'heading-3', fontWeight: 'bold', color: 'text' }),
  brandSubtitle: css({ textStyle: 'small', color: 'text-muted' }),
  nav: css({ display: 'flex', flexDirection: 'column', flex: '1', minH: '0' }),
  list: css({ display: 'flex', flexDirection: 'column', gap: '1' }),
  item: css({
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
  }),
};

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
      className={s.item}
      data-active={active || undefined}
      aria-current={active ? 'page' : undefined}
      onClick={() => { navigate({ to: item.to }); onNavigate(); }}
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
    <aside className={s.root} data-collapsed={collapsed} data-open={open}>
      <div className={s.brand}>
        <span className={s.logo}>K</span>
        <span className={s.brandText} data-brand-text>
          <span className={s.brandTitle}>Koi Admin</span>
          <span className={s.brandSubtitle}>Koi 组件库演示</span>
        </span>
      </div>
      <nav aria-label="主导航" className={s.nav}>
        <ul className={s.list}>
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
