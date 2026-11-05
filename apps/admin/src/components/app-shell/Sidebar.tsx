import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { SidebarContent } from './SidebarContent';
import {
  SAFE_BOTTOM,
  SAFE_LEFT,
  SAFE_TOP,
  SIDEBAR_TITLEBAR_STRIP,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  TITLEBAR_HEIGHT,
  TITLEBAR_INSET_LEFT,
} from './shared';

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
          // The aside holds the window's left edge: it widens by the left inset and pads past the insets, so
          // NavMenu keeps its usual geometry inside and the background still reaches the edge (MobileNav does
          // the same for the drawer).
          width: `calc(${SIDEBAR_WIDTH} + ${SAFE_LEFT})`,
          paddingBlockStart: `max(${SAFE_TOP}, ${SIDEBAR_TITLEBAR_STRIP})`,
          paddingInlineStart: SAFE_LEFT,
          paddingBlockEnd: SAFE_BOTTOM,
          bg: 'surface',
          borderRightWidth: '1px',
          borderRightStyle: 'solid',
          borderRightColor: 'divider',
          // Width collapse animates with a plain ease-out: the spring's overshoot makes the icons jitter.
          transition: 'width token(durations.fast) token(easings.out)',
          // The horizontal layout owns the desktop header; the aside stays out of the way there.
          '&[data-nav-layout=horizontal]': { display: 'none' },
          // Window controls on the left (macOS traffic lights) are wider than the 72px rail: the rail grows to hold
          // them, so they sit centered above the icons instead of across the rail's edge.
          '&[data-collapsed=true]': {
            width: `max(calc(${SIDEBAR_WIDTH_COLLAPSED} + ${SAFE_LEFT}), ${TITLEBAR_INSET_LEFT})`,
          },
        },
      })}
      data-collapsed={collapsed}
      data-nav-layout={navLayout}
    >
      {/* The sidebar's share of the title-bar strip moves the window, so the whole top edge drags alongside the
          header. With controls on the left it is the empty strip above the brand; with controls on the right
          (Windows) the sidebar starts at the top and the strip lies over the brand row, which holds no controls. */}
      <div
        aria-hidden="true"
        data-app-region="drag"
        className={css({ position: 'absolute', top: 0, insetInline: 0, height: TITLEBAR_HEIGHT })}
      />
      <SidebarContent pathname={pathname} rail={collapsed} />
    </aside>
  );
}
