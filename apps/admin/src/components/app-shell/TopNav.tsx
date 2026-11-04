import { NavMenu } from '@tuuject/koi-react/nav-menu';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { CONTENT_MAX_WIDTH, HEADER_ROW_HEIGHT } from './shared';
import { useNavMenu } from './use-nav-menu';

/**
 * Desktop horizontal navigation: row two of the shell header, below the topbar. Hidden below md, where the
 * sidebar's drawer is the only navigation. It shares the topbar's centered 1280px column; NavMenu scrolls its own
 * row sideways if the items ever outgrow it, instead of widening the column.
 *
 * No brand here: the topbar's first row already carries one. The wrapper owns the padding (NavMenu gets `padding: 0`).
 */
export function TopNav() {
  const pathname = useRouterState({ select: (st) => st.location.pathname });
  const { sections, onSelect } = useNavMenu();

  return (
    <div
      className={css({
        display: 'none',
        md: { display: 'flex' },
        width: '100%',
        maxWidth: CONTENT_MAX_WIDTH,
        // Same centered column as the topbar row above and the page content below.
        marginInline: 'auto',
        height: HEADER_ROW_HEIGHT,
        // Matches the topbar row and the page content at md.
        paddingInline: { base: '4', md: '6' },
      })}
    >
      <NavMenu
        orientation="horizontal"
        sections={sections}
        value={pathname}
        label="主导航"
        onSelect={onSelect}
        className={css({ padding: '0' })}
      />
    </div>
  );
}
