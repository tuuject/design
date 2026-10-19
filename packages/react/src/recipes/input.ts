import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { toPx } from './dimensions';

// Port of .koi-input* in reference/legacy-web/components/bundle.css and docs/spec/components/Input.md.
// The edge lives on the wrapper (root) so icons sit inside it; states are read off the <input> with :has(),
// which covers every source of them: the `invalid` prop, a Field error and Base UI's native validation.
// The state selectors never overlap (hover skips focused, invalid and disabled edges), so the order Panda
// emits them in doesn't matter. Invalid and disabled never meet: Base UI and Input drop aria-invalid when disabled.
const INVALID = '&:has(> input[aria-invalid=true])';
const DISABLED = '&:has(> input:disabled)';

export const input = defineSlotRecipe({
  className: 'koi-input',
  slots: ['root', 'el', 'icon'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      width: '100%',
      boxSizing: 'border-box',
      bg: 'surface',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderColor: 'border-control',
      borderRadius: 'xl',
      color: 'text',
      fontFamily: 'sans',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'fast',
      '&:hover:not(:focus-within, :has(> input:disabled, > input[aria-invalid=true]))': {
        borderColor: 'border-control-hover',
      },
      // The 1px edge plus a 1px shadow reads as a 2px edge without shifting the content (spec: drawn on the edge).
      '&:focus-within': { borderColor: 'focus-ring', boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.focus-ring}` },
      [INVALID]: { borderColor: 'error-control' },
      [`${INVALID}:focus-within`]: { boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.error-control}` },
      // Placeholder and icons fade with the value (legacy kept them text-muted, darker than the disabled value).
      [DISABLED]: {
        bg: 'surface-muted',
        color: 'text-disabled',
        borderColor: 'border',
        cursor: 'not-allowed',
        '& > *, & > input::placeholder': { color: 'text-disabled' },
      },
    },
    el: {
      flex: '1',
      minWidth: '0',
      height: '100%',
      m: '0',
      p: '0',
      borderWidth: '0',
      outline: 'none',
      bg: 'transparent',
      color: 'inherit',
      font: 'inherit',
      lineHeight: toPx(c.field.lineHeight),
      _placeholder: { color: 'text-muted' },
      _disabled: { cursor: 'not-allowed' },
    },
    icon: { display: 'inline-flex', flex: 'none', color: 'text-muted', '& > svg': { width: 'icon', height: 'icon' } },
  },
  variants: {
    // Heights match Button's, so an Input and a Button of one size line up in a row.
    size: {
      sm: { root: { height: 'control-sm', px: toPx(c.field.paddingXSm), textStyle: 'small' } },
      md: { root: { height: 'control-md', px: toPx(c.field.paddingXMd), textStyle: 'body' } },
      lg: { root: { height: 'control-lg', px: toPx(c.field.paddingXLg), textStyle: 'body' } },
    },
  },
  defaultVariants: { size: 'md' },
});
