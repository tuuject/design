import { defineSlotRecipe } from '@pandacss/dev';
import { components as c } from '@koi/tokens/dimensions';
import { focusRing, toPx } from './dimensions';

// docs/spec/components/Table.md. Plain table elements, no headless library: every selector here is a native
// element, the element's own ARIA (`aria-sort`) or Koi's own attribute (`data-koi-selected`).
// The parts are separate components, so `align` is resolved per cell: `table({ align })` and take one slot.
export const table = defineSlotRecipe({
  className: 'koi-table',
  slots: ['container', 'root', 'header', 'body', 'footer', 'row', 'headerCell', 'cell', 'sortButton', 'empty', 'caption', 'skeleton'],
  base: {
    // Wide tables scroll inside their container, never the page.
    container: { width: '100%', overflowX: 'auto' },
    root: {
      width: '100%',
      borderCollapse: 'collapse',
      fontFamily: 'sans',
      textStyle: 'body',
      color: 'text',
      // Amounts and times line up down a column.
      fontVariantNumeric: 'tabular-nums',
    },
    header: {},
    body: {},
    footer: {},
    row: {
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      // `height` on a row is its minimum in table layout (min-height is ignored on rows and cells); the cells keep
      // their padding, so taller content still grows the row.
      'tbody > &': { height: toPx(c.table.rowHeight) },
      'tbody > &:hover': { bg: 'surface-muted' },
      'tbody > &[data-koi-selected]': { bg: 'action-subtle' },
      'tbody > &[data-koi-selected]:hover': { bg: 'action-subtle-hover' },
    },
    headerCell: {
      px: '4',
      py: '2',
      borderBottomWidth: `${c.stroke.hairline}px`,
      borderBottomStyle: 'solid',
      borderBottomColor: 'divider',
      textAlign: 'start',
      verticalAlign: 'middle',
      textStyle: 'small',
      fontWeight: 'bold',
      color: 'text-muted',
      whiteSpace: 'nowrap',
    },
    cell: {
      px: '4',
      py: '2',
      borderBottomWidth: `${c.stroke.hairline}px`,
      borderBottomStyle: 'solid',
      borderBottomColor: 'divider',
      textAlign: 'start',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
    },
    // The whole header label is the button; it inherits the header's type and lines up with unsortable headers.
    sortButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      m: '0',
      p: '0',
      borderWidth: '0',
      borderRadius: 'sm',
      bg: 'transparent',
      color: 'inherit',
      font: 'inherit',
      textAlign: 'inherit',
      cursor: 'pointer',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _hover: { color: 'text' },
      _focusVisible: focusRing,
      '[aria-sort] > &': { color: 'text' },
      '& > svg': { flex: 'none', width: 'icon-sm', height: 'icon-sm', color: 'text-muted' },
      '[aria-sort] > & > svg': { color: 'text' },
    },
    empty: {
      py: '10',
      px: '4',
      textAlign: 'center',
      color: 'text-muted',
      whiteSpace: 'normal',
    },
    caption: { srOnly: true },
    // Hugs its sample content and follows the cell's text-align, so a loading column looks like the loaded one.
    skeleton: { display: 'inline-block', maxWidth: '100%', verticalAlign: 'middle', borderRadius: 'sm' },
  },
  variants: {
    layout: {
      auto: {},
      // Widths come from the first row (the header) and <col>s, never from the content.
      fixed: { root: { tableLayout: 'fixed', '& :is(th, td)': { overflow: 'hidden', textOverflow: 'ellipsis' } } },
    },
    align: {
      start: {},
      center: { headerCell: { textAlign: 'center' }, cell: { textAlign: 'center' } },
      end: { headerCell: { textAlign: 'end' }, cell: { textAlign: 'end' } },
    },
  },
  defaultVariants: { layout: 'auto', align: 'start' },
});
