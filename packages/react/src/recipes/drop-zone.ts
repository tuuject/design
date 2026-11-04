import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { focusRing, toPx } from './dimensions.js';
import { state } from './headless.js';

// New component (not a legacy port): docs/spec/components/DropZone.md. A dashed target that opens the platform
// picker on click, Space or Enter. Dragging is the component's own data attribute, not a headless library's.
export const dropZone = defineSlotRecipe({
  className: 'koi-drop-zone',
  slots: ['root', 'zone', 'icon', 'body', 'title', 'description'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '3', fontFamily: 'sans' },
    zone: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4',
      paddingBlock: '12',
      paddingInline: '8',
      borderWidth: toPx(c.dropZone.border),
      borderStyle: 'dashed',
      borderColor: 'border',
      borderRadius: 'panel',
      textAlign: 'center',
      cursor: 'pointer',
      transitionProperty: 'background-color, border-color',
      transitionDuration: 'fast',
      _hover: { borderColor: 'border-hover' },
      _focusVisible: focusRing,
      // Files are over the zone. Same sky as a checked control, over the tinted action fill.
      [`&${state.dragging}` as const]: { borderColor: 'control-checked', bg: 'action-subtle' },
      '&[aria-disabled=true]': {
        opacity: '0.5',
        cursor: 'not-allowed',
        _hover: { borderColor: 'border' },
      },
    },
    icon: {
      display: 'grid',
      placeItems: 'center',
      width: 'control-lg',
      height: 'control-lg',
      borderRadius: 'full',
      bg: 'action-subtle',
      color: 'on-action-subtle',
      transitionProperty: 'background-color, color',
      transitionDuration: 'fast',
    },
    body: { display: 'flex', flexDirection: 'column', gap: '1' },
    title: { textStyle: 'heading-3', color: 'text', margin: '0' },
    description: { textStyle: 'small', color: 'text-muted', margin: '0' },
  },
});
