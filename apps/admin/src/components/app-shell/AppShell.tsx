import { css } from '@tuuject/koi-react/styled-system/css';
import { Outlet } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { Sidebar } from './Sidebar';
import {
  CONTENT_MAX_WIDTH,
  HEADER_HEIGHT,
  HEADER_HEIGHT_HORIZONTAL,
  HEADER_OFFSET,
  HEADER_ROW_PADDING,
  SHELL_Z_INDEX,
  TOPBAR_Z_INDEX,
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
        [HEADER_OFFSET]: HEADER_HEIGHT,
        // Only md+ actually shows the nav row; below that the drawer is the navigation and the header is one row.
        '&[data-nav-layout=horizontal]': {
          md: { [HEADER_OFFSET]: HEADER_HEIGHT_HORIZONTAL },
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
        {/* One sticky block: the horizontal layout stacks its nav row under the topbar, both pinned. The
            8px air above, between and below the rows lives here, so both rows share one vertical rhythm and
            the block's bottom edge is the single header/content divider. */}
        <div
          className={css({
            position: 'sticky',
            top: 0,
            zIndex: TOPBAR_Z_INDEX,
            display: 'flex',
            flexDirection: 'column',
            gap: HEADER_ROW_PADDING,
            paddingBlock: HEADER_ROW_PADDING,
            bg: 'surface',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'divider',
          })}
        >
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
