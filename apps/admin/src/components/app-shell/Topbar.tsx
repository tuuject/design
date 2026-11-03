import { IconButton } from '@tuuject/koi-react/button';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useUiStore } from '../../stores/ui';
import { MenuIcon, PanelLeftIcon, RowsIcon } from '../icons';
import { Brand } from './Brand';
import { Breadcrumbs } from './Breadcrumbs';
import { CONTENT_MAX_WIDTH, TOPBAR_HEIGHT } from './shared';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

export function Topbar() {
  const sidebarCollapsed = useUiStore((st) => st.sidebarCollapsed);
  const navLayout = useUiStore((st) => st.navLayout);
  const toggleSidebar = useUiStore((st) => st.toggleSidebar);
  const setNavLayout = useUiStore((st) => st.setNavLayout);
  const setMobileNavOpen = useUiStore((st) => st.setMobileNavOpen);
  const horizontal = navLayout === 'horizontal';

  return (
    <header
      data-flush={horizontal || undefined}
      className={css({
        display: 'flex',
        bg: 'surface',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'divider',
        // The horizontal layout stacks a nav row underneath: the row's own bottom edge is the header/content
        // divider, so a rule between the two rows would read as a stray line in the middle of the header.
        '&[data-flush=true]': { borderBottomWidth: '0' },
      })}
    >
      <div
        data-narrow={horizontal || undefined}
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '2',
          width: '100%',
          height: TOPBAR_HEIGHT,
          paddingInline: '4',
          // Same centered column as the nav row and the page content below it: same cap, same 24px inner
          // padding at md, so the brand and the page's left edge line up.
          '&[data-narrow=true]': {
            maxWidth: CONTENT_MAX_WIDTH,
            marginInline: 'auto',
            md: { paddingInline: '6' },
          },
        })}
      >
        <IconButton
          icon={<MenuIcon />}
          label="打开导航"
          size="sm"
          className={css({ display: 'flex', md: { display: 'none' } })}
          onClick={() => setMobileNavOpen(true)}
        />
        {horizontal ? (
          <>
            {/* The sidebar carries the brand in the other layout; here it joins the first header row. */}
            <div className={css({ display: 'none', md: { display: 'flex' } })}>
              <Brand compact />
            </div>
            <span
              aria-hidden="true"
              className={css({
                display: 'none',
                md: { display: 'block' },
                flexShrink: '0',
                width: '1px',
                height: '1rem',
                // The row's 8px gap reads tight between the wordmark and the crumb trail: 8px more on each
                // side of the divider makes both gaps 16px.
                marginInline: '2',
                bg: 'divider',
              })}
            />
          </>
        ) : (
          <IconButton
            icon={<PanelLeftIcon />}
            label={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
            size="sm"
            aria-expanded={!sidebarCollapsed}
            className={css({ display: 'none', md: { display: 'flex' } })}
            onClick={toggleSidebar}
          />
        )}
        <Breadcrumbs />
        <div className={css({ flex: '1' })} />
        <ThemeToggle />
        <IconButton
          icon={horizontal ? <PanelLeftIcon /> : <RowsIcon />}
          label={horizontal ? '切换到侧边导航' : '切换到水平导航'}
          size="sm"
          className={css({ display: 'none', md: { display: 'flex' } })}
          onClick={() => setNavLayout(horizontal ? 'sidebar' : 'horizontal')}
        />
        <UserMenu />
      </div>
    </header>
  );
}
