import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-card* in reference/legacy-web/components/bundle.css and docs/spec/components/Card.md.
export const card = defineSlotRecipe({
  className: 'koi-card',
  slots: ['root', 'media', 'head', 'title', 'description', 'body', 'footer'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3',
      p: '5',
      boxSizing: 'border-box',
      overflow: 'hidden',
      borderRadius: 'panel',
      fontFamily: 'sans',
      color: 'text',
    },
    // Bleeds over the root's padding so the media sits flush with the rounded top edge.
    media: { mx: '-5', mt: '-5', '& > *': { display: 'block', width: '100%' } },
    head: { display: 'flex', flexDirection: 'column', gap: '1' },
    title: { m: '0', textStyle: 'heading-3' },
    description: { m: '0', textStyle: 'small', color: 'text-muted' },
    body: { textStyle: 'body' },
    footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '2' },
  },
  variants: {
    variant: {
      outlined: { root: { bg: 'surface', borderWidth: '1px', borderStyle: 'solid', borderColor: 'border' } },
      filled: { root: { bg: 'surface-muted' } },
      glass: { root: { bg: 'surface-glass', backdropFilter: 'blur(var(--blurs-panel))' } },
    },
    padding: {
      default: {},
      none: { root: { p: '0' }, media: { m: '0' } },
    },
  },
  defaultVariants: { variant: 'outlined', padding: 'default' },
});
