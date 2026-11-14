import { defineSlotRecipe } from '@pandacss/dev/define';

// A page's heading block: the h1 (with an optional info mark beside it) and a one-line description on the left,
// page-level actions on the right. The root is a container so the actions drop under the title block by the width
// they actually have, not the viewport's: the same header sits in a full-width page and in a 768px form column.
export const pageHeader = defineSlotRecipe({
  className: 'koi-page-header',
  slots: ['root', 'main', 'titleRow', 'title', 'info', 'description', 'actions'],
  base: {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '4',
      marginBlockEnd: '6',
      containerType: 'inline-size',
    },
    // flex 1 + minWidth 0: the title block takes the leftover width and its long description wraps rather than
    // pushing the actions off the row.
    main: { display: 'flex', flexDirection: 'column', gap: '1', flex: '1', minWidth: '0' },
    titleRow: { display: 'flex', alignItems: 'center', gap: '2', minWidth: '0' },
    // An unbroken title (an order number, an ID) breaks where it must instead of pushing the info mark out.
    title: {
      m: '0',
      minWidth: '0',
      overflowWrap: 'anywhere',
      textStyle: 'heading-1',
      fontWeight: 'bold',
      color: 'text',
    },
    // The mark keeps its size; it never squeezes the title.
    info: { display: 'inline-flex', alignItems: 'center', flexShrink: '0', color: 'text-muted' },
    description: { m: '0', textStyle: 'body', color: 'text-muted', overflowWrap: 'anywhere', hyphens: 'auto' },
    actions: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '2',
      flex: 'none',
      // Pushed right, so it lines up with the page's right edge even when the title block is short.
      marginInlineStart: 'auto',
      // Below ~480px of header the title and its actions can't share a row without the title collapsing to a few
      // characters, so the actions take a row of their own. A container query, not a breakpoint: the header is
      // narrower than the viewport inside the form pages' 768px column. koi-web-only: a container breakpoint, not
      // a component size, and breakpoints aren't tokens yet (plan.md 未决事项).
      '@container (max-width: 30rem)': { flexBasis: '100%', marginInlineStart: '0' },
    },
  },
});
