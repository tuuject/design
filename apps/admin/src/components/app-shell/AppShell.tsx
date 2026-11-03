import { css } from '@tuuject/koi-react/styled-system/css';
import { Outlet } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { Sidebar } from './Sidebar';
import {
  CONTENT_MAX_WIDTH,
  HEADER_OFFSET,
  SHELL_Z_INDEX,
  TOPBAR_HEIGHT,
  TOPBAR_Z_INDEX,
  TOP_NAV_HEIGHT,
} from './shared';
import { Topbar } from './Topbar';
import { TopNav } from './TopNav';

/** The authenticated app chrome: off-canvas sidebar on mobile, sticky header, routed content. */
export function AppShell() {
  const open = useUiStore((st) => st.mobileNavOpen);
  const navLayout = useUiStore((st) => st.navLayout);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);

  return (
    <div
      className={css({
        display: 'flex',
        minHeight: '100%',
        bg: 'page-bg',
        // Pages (sectioned form jump targets, sticky sub-headers) read this instead of assuming the chrome.
        [HEADER_OFFSET]: TOPBAR_HEIGHT,
        // Only md+ actually shows the nav row; below that the drawer is the navigation and the header is one row.
        '&[data-nav-layout=horizontal]': {
          md: { [HEADER_OFFSET]: `calc(${TOPBAR_HEIGHT} + ${TOP_NAV_HEIGHT})` },
        },
      })}
      data-nav-layout={navLayout}
    >
      <button
        type="button"
        className={css({
          position: 'fixed',
          inset: '0',
          zIndex: SHELL_Z_INDEX - 5,
          border: 'none',
          padding: '0',
          bg: 'backdrop',
          backdropFilter: 'blur(var(--blurs-panel))',
          cursor: 'pointer',
          opacity: '0',
          pointerEvents: 'none',
          transitionProperty: 'opacity',
          transitionDuration: 'fast',
          md: { display: 'none' },
          '&[data-open=true]': { opacity: '1', pointerEvents: 'auto' },
        })}
        data-open={open}
        aria-label="关闭导航"
        tabIndex={open ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <Sidebar />
      <div className={css({ display: 'flex', flexDirection: 'column', flex: '1', minW: '0' })}>
        {/* One sticky block: the horizontal layout stacks its nav row under the topbar, both pinned. */}
        <div className={css({ position: 'sticky', top: 0, zIndex: TOPBAR_Z_INDEX, bg: 'surface' })}>
          <Topbar />
          {navLayout === 'horizontal' ? <TopNav /> : null}
        </div>
        <main
          className={css({
            flex: '1',
            padding: '4',
            md: { padding: '6' },
            // The horizontal layout is one centered column: header rows and content line up on the same cap.
            '&[data-narrow=true]': {
              width: '100%',
              maxWidth: CONTENT_MAX_WIDTH,
              marginInline: 'auto',
            },
          })}
          data-narrow={navLayout === 'horizontal' || undefined}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
