import { Drawer } from '@tuuject/koi-react/drawer';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { SAFE_BOTTOM, SAFE_LEFT, SAFE_TOP, SIDEBAR_TITLEBAR_STRIP, SIDEBAR_WIDTH } from './shared';
import { SidebarContent } from './SidebarContent';

/**
 * The navigation below md, as a drawer from the left edge: the same brand and list as the desktop sidebar.
 * Koi's Drawer brings the backdrop, focus trap, Esc, scroll lock and focus return; route changes close it
 * (index.tsx subscribes to the router, so back and forward count too).
 */
export function MobileNav() {
  const open = useUiStore((st) => st.mobileNavOpen);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  return (
    <Drawer
      open={open}
      onOpenChange={setMobileNavOpen}
      side="left"
      title="主导航"
      // The content starts with the brand and the nav list, which already say what this is.
      hideTitle
      // The drawer keeps the sidebar's 248px, so the list lands on the same left edge as on desktop. Both the
      // popup and its body hand their padding to NavMenu, which insets the brand and the rows itself; the popup
      // only adds the safe-area insets, the same way the desktop Sidebar does.
      className={css({
        width: `calc(${SIDEBAR_WIDTH} + ${SAFE_LEFT})`,
        paddingBlockStart: `max(${SAFE_TOP}, ${SIDEBAR_TITLEBAR_STRIP})`,
        paddingInlineStart: SAFE_LEFT,
        paddingInlineEnd: '0',
        paddingBlockEnd: SAFE_BOTTOM,
      })}
      classNames={{
        body: css({ padding: '0', overflow: 'hidden' }),
        // Absolutely placed, so the popup's padding doesn't move it: keep it below an iOS status bar.
        close: css({ top: `calc(token(spacing.3) + ${SAFE_TOP})` }),
      }}
    >
      <SidebarContent pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
    </Drawer>
  );
}
