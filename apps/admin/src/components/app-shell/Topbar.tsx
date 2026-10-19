import { IconButton } from '@koi/react/button';
import { css } from '@koi/react/styled-system/css';
import { useUiStore } from '../../stores/ui';
import { MenuIcon, PanelLeftIcon } from '../icons';
import { Breadcrumbs } from './Breadcrumbs';
import { TOPBAR_HEIGHT, TOPBAR_Z_INDEX } from './shared';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export function Topbar() {
  const sidebarCollapsed = useUiStore((st) => st.sidebarCollapsed);
  const toggleSidebar = useUiStore((st) => st.toggleSidebar);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);

  return (
    <header
      className={css({
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
      })}
    >
      <IconButton
        icon={<MenuIcon />}
        label="打开导航"
        size="sm"
        className={css({ display: 'flex', md: { display: 'none' } })}
        onClick={() => setMobileNavOpen(true)}
      />
      <IconButton
        icon={<PanelLeftIcon />}
        label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        size="sm"
        aria-expanded={!sidebarCollapsed}
        className={css({ display: 'none', md: { display: 'flex' } })}
        onClick={toggleSidebar}
      />
      <Breadcrumbs />
      <div className={css({ flex: '1' })} />
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
