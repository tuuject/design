import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { SidebarContent } from './SidebarContent';
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from './shared';

/** The desktop navigation: the shell's first flex column, pinned to the viewport from md up. Below md the
 * mobile drawer is the navigation, so the aside is not rendered there at all. NavMenu owns the padding. */
export function Sidebar() {
  const collapsed = useUiStore((st) => st.sidebarCollapsed);
  const navLayout = useUiStore((st) => st.navLayout);
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  return (
    <aside
      className={css({
        display: 'none',
        md: {
          display: 'flex',
          flexDirection: 'column',
          // Sticky rather than fixed so it keeps its width in the row and the collapse animation still pushes
          // the content over.
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
          height: '100dvh',
          width: SIDEBAR_WIDTH,
          bg: 'surface',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'divider',
          // Width collapse animates with a plain ease-out: the spring's overshoot makes the icons jitter.
          transition: 'width token(durations.fast) token(easings.out)',
          // The horizontal layout owns the desktop header; the aside stays out of the way there.
          '&[data-nav-layout=horizontal]': { display: 'none' },
          '&[data-collapsed=true]': { width: SIDEBAR_WIDTH_COLLAPSED },
        },
      })}
      data-collapsed={collapsed}
      data-nav-layout={navLayout}
    >
      <SidebarContent pathname={pathname} rail={collapsed} />
    </aside>
  );
}
