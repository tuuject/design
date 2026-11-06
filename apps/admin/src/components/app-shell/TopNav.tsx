import { NavMenu } from '@tuuject/koi-react/nav-menu';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useRouterState } from '@tanstack/react-router';
import { COLUMN_OFFSET, CONTENT_MAX_WIDTH, HEADER_ROW_HEIGHT, SAFE_LEFT, SAFE_RIGHT } from './shared';
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
        width: '100%',
        maxWidth: CONTENT_MAX_WIDTH,
        // Same centered column as the topbar row above and the page content below.
        marginInline: 'auto',
        height: HEADER_ROW_HEIGHT,
        md: {
          display: 'flex',
          // Matches the page content at md: the usual 24px, or more where a side cutout reaches into the column.
          // Below the title-bar strip, so window controls don't concern this row.
          paddingInlineStart: `max(token(spacing.6), calc(${SAFE_LEFT} - ${COLUMN_OFFSET}))`,
          paddingInlineEnd: `max(token(spacing.6), calc(${SAFE_RIGHT} - ${COLUMN_OFFSET}))`,
        },
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
