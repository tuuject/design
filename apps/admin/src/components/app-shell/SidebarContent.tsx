import { css } from '@tuuject/koi-react/styled-system/css';
import { NAV_GROUPS } from '../../nav';
import { Brand } from './Brand';
import { NavFlyout } from './NavFlyout';
import { NavGroupItem } from './NavGroupItem';

interface SidebarContentProps {
  pathname: string;
  /** Collapsed rail (md and up): groups open beside the rail instead of expanding in place. */
  rail?: boolean;
  onNavigate?: () => void;
}

/**
 * The brand and the navigation list, shared by the desktop sidebar and the mobile drawer so the two can't drift.
 * The container supplies the padding and the width; this only lays the two blocks out and lets the list scroll.
 */
export function SidebarContent({ pathname, rail = false, onNavigate }: SidebarContentProps) {
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6', flex: '1', minHeight: '0' })}>
      <Brand />
      <nav
        aria-label="主导航"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
          minH: '0',
          // The rail can outgrow the viewport; the list scrolls rather than pushing the brand out.
          overflowY: 'auto',
        })}
      >
        <ul className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          {NAV_GROUPS.map((group) => (
            <li key={group.title}>
              {/* Collapsed to icons, the in-place panel has no labels left to show: the group opens beside the
                  rail instead, the same panel the horizontal bar uses. */}
              {rail ? (
                <NavFlyout group={group} pathname={pathname} side="right" collapsed />
              ) : (
                <NavGroupItem group={group} pathname={pathname} onNavigate={onNavigate} />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
