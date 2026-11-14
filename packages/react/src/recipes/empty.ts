import { defineSlotRecipe } from '@pandacss/dev/define';

// docs/spec/components/Empty.md. Shared with Table's empty row, so a page's empty state and a table's look alike.
export const empty = defineSlotRecipe({
  className: 'koi-empty',
  slots: ['root', 'icon', 'title', 'description', 'action'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2',
      width: '100%',
      px: '4',
      py: '10',
      boxSizing: 'border-box',
      textAlign: 'center',
      color: 'text-muted',
      fontFamily: 'sans',
      textStyle: 'body',
    },
    // No size of its own: an arbitrary child (Icon, illustration) keeps whatever size it was given.
    icon: { display: 'inline-flex', color: 'text-muted' },
    title: { m: '0', textStyle: 'label', color: 'text', overflowWrap: 'anywhere' },
    description: { m: '0', textStyle: 'small', color: 'text-muted', overflowWrap: 'anywhere', hyphens: 'auto' },
    action: { marginBlockStart: '2', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2' },
  },
  variants: {
    variant: {
      default: {},
      // A table cell owns its row height and keeps the table's muted body copy, so Empty only draws the content.
      plain: { root: { p: '0' }, title: { textStyle: 'body', color: 'text-muted' } },
    },
  },
  defaultVariants: { variant: 'default' },
});
