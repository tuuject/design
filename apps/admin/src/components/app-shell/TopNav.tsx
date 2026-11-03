import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { NAV_GROUPS } from '../../nav';
import { NavFlyout } from './NavFlyout';
import { CONTENT_MAX_WIDTH, TOP_NAV_HEIGHT } from './shared';

/**
 * Desktop horizontal navigation: row two of the shell header, below the topbar. Hidden below md, where the
 * sidebar's drawer is the only navigation. It shares the topbar's centered 1280px column; if the items ever
 * outgrow it, the row scrolls sideways instead of widening the column.
 *
 * Every top-level item is a group (概览, 业务, 智能助手, 账户): the row itself holds only groups, each opening its
 * pages in a flyout below. There is no flat leaf at this level, so the row stays short as the app grows.
 */
export function TopNav() {
  const pathname = useRouterState({ select: (st) => st.location.pathname });

  return (
    <nav
      aria-label="主导航"
      className={css({
        display: 'none',
        md: { display: 'flex' },
        bg: 'surface',
        // The header/content divider: the topbar above drops its own rule in this layout.
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'divider',
      })}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          // Same centered column as the topbar row above and the page content below.
          marginInline: 'auto',
          height: TOP_NAV_HEIGHT,
          paddingInline: '4',
          // Matches the topbar row and the page content at md.
          md: { paddingInline: '6' },
          overflowX: 'auto',
        })}
      >
        <ul className={css({ display: 'flex', alignItems: 'center', gap: '1', minW: 'max-content' })}>
          {NAV_GROUPS.map((group) => (
            <li key={group.title}>
              <NavFlyout group={group} pathname={pathname} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
