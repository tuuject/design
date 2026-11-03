import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { NAV_ITEMS } from '../../nav';
import { useUiStore } from '../../stores/ui';
import { Brand } from './Brand';
import { NavItemButton } from './NavItemButton';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './shared';

export function Sidebar() {
  const collapsed = useUiStore((st) => st.sidebarCollapsed);
  const navLayout = useUiStore((st) => st.navLayout);
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
        // Edge-anchored drawer: the spring's overshoot would pull it off the left edge and show a gap.
        transition: 'transform token(durations.overlay) token(easings.out)',
        '&[data-open=true]': { transform: 'translateX(0)' },
        md: {
          position: 'sticky',
          alignSelf: 'flex-start',
          height: '100dvh',
          transform: 'none',
          // Width collapse animates with a plain ease-out: the spring's overshoot makes the icons jitter.
          transition: 'width token(durations.fast) token(easings.out)',
          width: SIDEBAR_WIDTH,
          // The horizontal layout owns the desktop header; the aside stays only as the mobile drawer.
          '&[data-nav-layout=horizontal]': { display: 'none' },
          '&[data-collapsed=true]': {
            width: SIDEBAR_WIDTH_COLLAPSED,
            '& [data-nav-label], & [data-brand-text]': { display: 'none' },
            '& [data-nav-item]': { justifyContent: 'center', paddingInline: '0' },
          },
        },
      })}
      data-collapsed={collapsed}
      data-nav-layout={navLayout}
      data-open={open}
    >
      <Brand />
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
