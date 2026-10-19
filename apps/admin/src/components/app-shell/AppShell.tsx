import { css } from '@koi/react/styled-system/css';
import { Outlet, useRouterState } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useUiStore } from '../../stores/ui';
import { Sidebar } from './Sidebar';
import { SHELL_Z_INDEX } from './shared';
import { Topbar } from './Topbar';

const s = {
  root: css({ display: 'flex', minHeight: '100%', bg: 'page-bg' }),
  backdrop: css({
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
  }),
  main: css({ display: 'flex', flexDirection: 'column', flex: '1', minW: '0' }),
  content: css({ flex: '1', padding: '4', md: { padding: '6' } }),
};

/** The authenticated app chrome: off-canvas sidebar on mobile, sticky topbar, routed content. */
export function AppShell() {
  const open = useUiStore((st) => st.mobileNavOpen);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  // Any navigation closes the mobile drawer (skip the very first render).
  const mounted = useRef(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: the effect must re-run on every navigation
  useEffect(() => {
    if (mounted.current) {
      setMobileNavOpen(false);
    }
    mounted.current = true;
  }, [pathname, setMobileNavOpen]);

  return (
    <div className={s.root}>
      <button
        type="button"
        className={s.backdrop}
        data-open={open}
        aria-label="关闭导航"
        tabIndex={open ? 0 : -1}
        onClick={() => setMobileNavOpen(false)}
      />
      <Sidebar />
      <div className={s.main}>
        <Topbar />
        <main className={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
