import { css } from '@tuuject/koi-react/styled-system/css';
import { focusRing } from './shared';

export type NavOrientation = 'vertical' | 'horizontal';

/**
 * One navigation row, shared by groups and their pages so both line up. Both layouts follow NavMenu's item rules
 * (36px, 16px icon, radius-xl, nav-item-* fills); a group's pages drop the icon and indent instead. Orientation
 * arrives as `data-orientation`, so the same class serves the sidebar, the drawer and the horizontal bar.
 */
export const navItemClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  height: 'control-md',
  paddingInline: '2',
  borderRadius: 'xl',
  color: 'nav-item-text',
  textStyle: 'body',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transitionProperty: 'background-color, color',
  transitionDuration: 'fast',
  _hover: { bg: 'nav-item-hover' },
  _focusVisible: focusRing,
  // The horizontal row scrolls sideways, so its ring is drawn inside or the scroll box clips it.
  '&[data-orientation=horizontal]:focus-visible': { outlineOffset: '-2px' },
  '&[data-active=true]': { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
  // A parent holding the current page is bold in the sidebar; in the one-line bar it takes the current fill,
  // because there is no expanded tree there to show where the page sits.
  '&[data-in-path=true]': { color: 'text', fontWeight: 'bold' },
  '&[data-orientation=horizontal][data-in-path=true]': { bg: 'nav-item-active' },
  // Same in the collapsed rail: the branch is hidden, so its icon carries the fill.
  '&[data-rail=true][data-in-path=true]': { bg: 'nav-item-active' },
  '&[data-orientation=vertical]': { width: '100%', textAlign: 'left' },
  '&[data-orientation=horizontal]': { flexShrink: '0' },
  // Collapsible and Menu triggers both flip the chevron while their panel is open.
  '&[data-panel-open] [data-nav-chevron], &[data-popup-open] [data-nav-chevron]': { transform: 'rotate(180deg)' },
});

export const navChevronClass = css({
  display: 'flex',
  flexShrink: '0',
  // Pushes to the end of a full-width sidebar row; the bar's rows are content-sized, so it just follows the label.
  marginInlineStart: 'auto',
  color: 'text-muted',
  transition: 'transform token(durations.check) token(easings.spring)',
});

/** A group's page inside its panel: level 2, so no icon and indented under the group's label. */
export const navChildClass = css({
  // 8px row padding + 16px icon + 8px gap. A nested selector would work too, but Panda leaves a size token in
  // a nested value unresolved, so the indent is its own class on a top-level property.
  paddingInlineStart: '8',
});
