import { css } from '@koi/react/styled-system/css';
import { Outlet } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { Sidebar } from './Sidebar';
import { SHELL_Z_INDEX } from './shared';
import { Topbar } from './Topbar';

/** The authenticated app chrome: off-canvas sidebar on mobile, sticky topbar, routed content. */
export function AppShell() {
  const open = useUiStore((st) => st.mobileNavOpen);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);

  return (
    <div className={css({ display: 'flex', minHeight: '100%', bg: 'page-bg' })}>
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
        <Topbar />
        <main className={css({ flex: '1', padding: '4', md: { padding: '6' } })}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
