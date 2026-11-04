import { Drawer } from '@tuuject/koi-react/drawer';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { useUiStore } from '../../stores/ui';
import { SIDEBAR_WIDTH } from './shared';
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
      // popup and its body hand their padding to NavMenu, which insets the brand and the rows itself.
      className={css({ width: SIDEBAR_WIDTH, padding: '0' })}
      classNames={{ body: css({ padding: '0', overflow: 'hidden' }) }}
    >
      <SidebarContent pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
    </Drawer>
  );
}
