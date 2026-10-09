import { defineRecipe } from '@pandacss/dev';

// Port of .koi-textarea in reference/legacy-web/components/bundle.css and docs/spec/components/Textarea.md.
// Same edge, corners, focus and invalid states as Input (recipes/input.ts), on the element itself.
// The state selectors don't overlap, so the order Panda emits them in doesn't matter.
export const textarea = defineRecipe({
  className: 'koi-textarea',
  base: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '[80px]',
    m: '0',
    py: '2',
    px: '3',
    resize: 'vertical',
    bg: 'surface',
    color: 'text',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'border-control',
    borderRadius: 'xl',
    outline: 'none',
    fontFamily: 'sans',
    textStyle: 'body',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: 'fast',
    _placeholder: { color: 'text-muted' },
    '&:hover:not(:focus, :disabled, [aria-invalid=true])': { borderColor: 'border-control-hover' },
    '&:focus': { borderColor: 'focus-ring', boxShadow: '0 0 0 1px {colors.focus-ring}' },
    '&[aria-invalid=true]': { borderColor: 'error-control' },
    '&[aria-invalid=true]:focus': { borderColor: 'error-control', boxShadow: '0 0 0 1px {colors.error-control}' },
    '&:disabled': {
      bg: 'surface-muted',
      color: 'text-disabled',
      borderColor: 'border',
      cursor: 'not-allowed',
      '&::placeholder': { color: 'text-disabled' },
    },
  },
});
