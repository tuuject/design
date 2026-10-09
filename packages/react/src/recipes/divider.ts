import { defineRecipe } from '@pandacss/dev';

const line = { borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'divider' } as const;

// Port of .koi-divider in reference/legacy-web/components/bundle.css and docs/spec/components/Divider.md.
// Keyed `separator`: preset-base already has a `divider` pattern. `kind` is internal: Divider picks it from `orientation` and `label`.
export const separator = defineRecipe({
  className: 'koi-divider',
  base: { flexShrink: '0', borderWidth: '0' },
  variants: {
    kind: {
      line: { ...line, width: 'full', my: '4' },
      label: {
        display: 'flex',
        alignItems: 'center',
        gap: '3',
        width: 'full',
        my: '4',
        fontFamily: 'sans',
        textStyle: 'small',
        color: 'text-muted',
        _before: { content: '""', flex: '1', ...line },
        _after: { content: '""', flex: '1', ...line },
      },
      vertical: { display: 'inline-block', alignSelf: 'stretch', width: '1px', minHeight: '1em', mx: '2', bg: 'divider' },
    },
  },
  defaultVariants: { kind: 'line' },
});
