import { defineSlotRecipe } from '@pandacss/dev';
import { components as c } from '@koi/tokens/dimensions';
import { focusRing, toPx } from './dimensions';

// Port of .koi-alert* in reference/legacy-web/components/bundle.css and docs/spec/components/Alert.md.
export const alert = defineSlotRecipe({
  className: 'koi-alert',
  slots: ['root', 'icon', 'content', 'title', 'body', 'action', 'close'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      gap: '2',
      p: '3',
      boxSizing: 'border-box',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderRadius: 'xl',
      fontFamily: 'sans',
      textStyle: 'body',
    },
    // 2px down so the 16px icon centers on the title's first 20px line.
    icon: { flex: 'none', display: 'inline-flex', mt: toPx(c.alert.iconOffset), '& > svg': { width: 'icon', height: 'icon' } },
    // space-1 between title and body; the action sits space-3 below (gap + mt).
    content: { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '1' },
    title: { m: '0', fontWeight: '700' },
    body: { color: 'text', '& p': { m: '0' } },
    action: { mt: '2', display: 'flex', flexWrap: 'wrap', gap: '2' },
    close: {
      position: 'absolute',
      top: '2',
      insetInlineEnd: '2',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: toPx(c.closeButton.size),
      height: toPx(c.closeButton.size),
      p: '0',
      borderWidth: '0',
      borderRadius: 'full',
      bg: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _hover: { bg: 'divider' },
      _focusVisible: focusRing,
      '& > svg': { width: 'icon', height: 'icon' },
    },
  },
  variants: {
    tone: {
      info: { root: { bg: 'info-surface', borderColor: 'info-border', color: 'info-text' } },
      warning: { root: { bg: 'warning-surface', borderColor: 'warning-border', color: 'warning-text' } },
      error: { root: { bg: 'error-surface', borderColor: 'error-border', color: 'error-text' } },
    },
    // Room on the right for the close button (legacy: padding-inline-end space-10).
    closable: {
      true: { root: { pe: '10' } },
      false: {},
    },
  },
  defaultVariants: { tone: 'info', closable: false },
});
