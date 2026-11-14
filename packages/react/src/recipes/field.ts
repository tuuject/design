import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';

// Port of .koi-field* in reference/legacy-web/components/bundle.css and docs/spec/components/Field.md.
export const field = defineSlotRecipe({
  className: 'koi-field',
  slots: ['root', 'label', 'required', 'optional', 'error', 'help'],
  base: {
    // 6px between label, control, error and help (legacy; no spacing token is 6px).
    root: { display: 'flex', flexDirection: 'column', gap: toPx(c.field.gap), fontFamily: 'sans', minWidth: '0' },
    // Labels and messages wrap instead of widening the form column: a translated label with a compound word in it is
    // still one label, so it breaks rather than pushing the control out.
    label: { textStyle: 'label', color: 'text', overflowWrap: 'break-word' },
    required: { color: 'error-text' },
    optional: { fontWeight: '400', color: 'text-muted' },
    // The icon carries the meaning too, so the error never relies on color alone.
    error: {
      m: '0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1',
      textStyle: 'small',
      color: 'error-text',
      // `anywhere` + min-width on the text: the message is a flex item beside the icon, and a flex item's automatic
      // minimum is its longest word, so a German compound would widen the row instead of wrapping.
      overflowWrap: 'anywhere',
      '& > span': { minWidth: '0' },
      // 2px down centers the 12px icon on the 16px line.
      '& > svg': { flex: 'none', width: 'icon-xs', height: 'icon-xs', mt: toPx(c.field.iconOffset) },
    },
    help: { m: '0', textStyle: 'small', color: 'text-muted', overflowWrap: 'break-word', hyphens: 'auto' },
  },
});
