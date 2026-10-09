import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-field* in reference/legacy-web/components/bundle.css and docs/spec/components/Field.md.
export const field = defineSlotRecipe({
  className: 'koi-field',
  slots: ['root', 'label', 'required', 'optional', 'error', 'help'],
  base: {
    // 6px between label, control, error and help (legacy; no spacing token is 6px).
    root: { display: 'flex', flexDirection: 'column', gap: '[6px]', fontFamily: 'sans' },
    label: { textStyle: 'label', color: 'text' },
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
      // 2px down centers the 12px icon on the 16px line.
      '& > svg': { flex: 'none', width: '[12px]', height: '[12px]', mt: '[2px]' },
    },
    help: { m: '0', textStyle: 'small', color: 'text-muted' },
  },
});
