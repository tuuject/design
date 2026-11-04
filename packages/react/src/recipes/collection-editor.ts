import { defineSlotRecipe } from '@pandacss/dev/define';

// MapEditor and SetEditor share every part but the field count: same rows, handle, spacing and add button.
// docs/spec/components/MapEditor.md describes the behavior. A dragged row is the only thing here that floats.
export const collectionEditor = defineSlotRecipe({
  className: 'koi-collection-editor',
  slots: ['root', 'list', 'row', 'handle', 'fields', 'arrow', 'remove', 'add', 'empty'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '3', fontFamily: 'sans' },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      m: '0',
      p: '0',
      listStyleType: 'none',
    },
    row: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '2',
      borderRadius: 'xl',
      transitionProperty: 'background-color, box-shadow',
      transitionDuration: 'fast',
    },
    // The handle is one control tall, so it lines up with the fields beside it.
    handle: {
      flex: 'none',
      color: 'text-muted',
      cursor: 'grab',
      touchAction: 'none',
      // Native :active only; the preset's `_active` condition also matches Base UI's [data-active].
      '&:active': { cursor: 'grabbing' },
    },
    fields: { display: 'grid', flex: '1', minWidth: '0', gap: '2', alignItems: 'start' },
    arrow: {
      display: 'grid',
      placeItems: 'center',
      height: 'control-md',
      color: 'text-muted',
      '& > svg': { width: 'icon', height: 'icon' },
    },
    remove: { flex: 'none' },
    add: { alignSelf: 'flex-start' },
    empty: { m: '0', paddingBlock: '2', color: 'text-muted' },
  },
  variants: {
    // Map rows read key → value; Set rows are a single column.
    layout: {
      map: { fields: { gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)' } },
      set: { fields: { gridTemplateColumns: 'minmax(0, 1fr)' } },
    },
    // Lifted while the pointer or keyboard holds it. The row keeps its size, so the list doesn't jump.
    dragging: {
      true: {
        row: {
          zIndex: '1',
          bg: 'surface',
          boxShadow: 'float',
        },
      },
      false: {},
    },
    disabled: {
      true: { root: { opacity: '0.5' } },
      false: {},
    },
  },
  defaultVariants: { layout: 'set', dragging: false, disabled: false },
});
