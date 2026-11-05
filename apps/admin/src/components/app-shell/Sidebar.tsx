import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { useMediaQuery } from '../../hooks/use-media-query';
import { NAV_GROUPS } from '../../nav';
import { useUiStore } from '../../stores/ui';
import { Brand } from './Brand';
import { NavFlyout } from './NavFlyout';
import { NavGroupItem } from './NavGroupItem';
import {
  SAFE_BOTTOM,
  SAFE_LEFT,
  SAFE_TOP,
  SIDEBAR_TITLEBAR_STRIP,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from './shared';

// The sidebar always holds the window's left edge (as the drawer and as the desktop column): it widens by the
// left inset so the content inside keeps its usual geometry, and its background still reaches the edge.
const width = `calc(${SIDEBAR_WIDTH} + ${SAFE_LEFT})`;
const widthCollapsed = `calc(${SIDEBAR_WIDTH_COLLAPSED} + ${SAFE_LEFT})`;

export function Sidebar() {
  const collapsed = useUiStore((st) => st.sidebarCollapsed);
  const navLayout = useUiStore((st) => st.navLayout);
  const open = useUiStore((st) => st.mobileNavOpen);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  // Below md the aside is the full-width drawer, where the collapsed rail never applies: a group expands in place.
  const desktop = useMediaQuery('(min-width: 768px)');

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
        width,
        paddingBlockStart: `max(calc(token(spacing.3) + ${SAFE_TOP}), ${SIDEBAR_TITLEBAR_STRIP})`,
        paddingInlineStart: `calc(token(spacing.3) + ${SAFE_LEFT})`,
        paddingInlineEnd: '3',
        paddingBlockEnd: `calc(token(spacing.3) + ${SAFE_BOTTOM})`,
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
          width,
          // The horizontal layout owns the desktop header; the aside stays only as the mobile drawer.
          '&[data-nav-layout=horizontal]': { display: 'none' },
          '&[data-collapsed=true]': {
            width: widthCollapsed,
            '& [data-nav-label], & [data-brand-text], & [data-nav-chevron]': { display: 'none' },
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
          // The rail can outgrow the viewport; the list scrolls rather than pushing the brand out.
          overflowY: 'auto',
        })}
      >
        <ul className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          {NAV_GROUPS.map((group) => (
            <li key={group.title}>
              {/* Collapsed to icons, the in-place panel has no labels left to show: the group opens beside the
                  rail instead, the same panel the horizontal bar uses. */}
              {collapsed && desktop ? (
                <NavFlyout group={group} pathname={pathname} side="right" collapsed />
              ) : (
                <NavGroupItem group={group} pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
