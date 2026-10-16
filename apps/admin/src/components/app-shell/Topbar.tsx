import { css } from '@koi/react/styled-system/css';
import { IconButton } from '@koi/react/button';
import { MenuIcon, PanelLeftIcon } from '../icons';
import { Breadcrumbs } from './Breadcrumbs';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { useUiStore } from '../../stores/ui';
import { TOPBAR_HEIGHT, TOPBAR_Z_INDEX } from './shared';

const s = {
  root: css({
    position: 'sticky',
    top: 0,
    zIndex: TOPBAR_Z_INDEX,
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    height: TOPBAR_HEIGHT,
    paddingInline: '4',
    bg: 'surface',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'divider',
  }),
  mobileOnly: css({ display: 'flex', md: { display: 'none' } }),
  desktopOnly: css({ display: 'none', md: { display: 'flex' } }),
  spacer: css({ flex: '1' }),
};

export function Topbar() {
  const sidebarCollapsed = useUiStore((st) => st.sidebarCollapsed);
  const toggleSidebar = useUiStore((st) => st.toggleSidebar);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);

  return (
    <header className={s.root}>
      <IconButton
        icon={<MenuIcon />}
        label="打开导航"
        size="sm"
        className={s.mobileOnly}
        onClick={() => setMobileNavOpen(true)}
      />
      <IconButton
        icon={<PanelLeftIcon />}
        label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        size="sm"
        aria-expanded={!sidebarCollapsed}
        className={s.desktopOnly}
        onClick={toggleSidebar}
      />
      <Breadcrumbs />
      <div className={s.spacer} />
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
