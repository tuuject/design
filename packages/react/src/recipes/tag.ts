import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { focusRing, toPx } from './dimensions.js';

// Port of .koi-tag* in reference/legacy-web/components/bundle.css and docs/spec/components/Tag.md.
// The root is always a <span>. A selectable tag puts a <button aria-pressed> (`toggle`) inside it whose ::before
// stretches over the whole pill, so the remove button can stay a sibling (no button inside a button).
// The pill draws the toggle's hover and focus ring through :has().
const TOGGLE = '> button[aria-pressed]';

export const tag = defineSlotRecipe({
  className: 'koi-tag',
  slots: ['root', 'toggle', 'icon', 'label', 'remove'],
  base: {
    root: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      // A floor plus a content-based height: a long keyword or a translated filter wraps and the pill grows taller,
      // while `align-items: stretch` in a flex row can't pull it to a sibling's height.
      minHeight: 'control-sm',
      height: 'fit-content',
      minWidth: '0',
      px: toPx(c.tag.paddingX),
      boxSizing: 'border-box',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderRadius: 'full',
      fontFamily: 'sans',
      textStyle: 'small',
      whiteSpace: 'normal',
      // `anywhere`: a keyword is content-sized, so only this lets one unbreakable word wrap inside a narrow slot.
      overflowWrap: 'anywhere',
      transitionProperty: 'background-color, color, border-color',
      transitionDuration: 'fast',
      [`&:has(${TOGGLE}:focus-visible)`]: focusRing,
    },
    toggle: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      minWidth: '0',
      p: '0',
      borderWidth: '0',
      bg: 'transparent',
      color: 'inherit',
      font: 'inherit',
      cursor: 'pointer',
      userSelect: 'none',
      outline: 'none',
      // The whole pill (border included) is the click target; the remove button sits above it.
      _before: { content: '""', position: 'absolute', inset: '[-1px]', borderRadius: 'full' }, // koi-web-only: a pseudo-element over the pill's edge,
    },
    icon: { display: 'inline-flex', flexShrink: '0', '& > svg': { width: 'icon-sm', height: 'icon-sm' } },
    label: { minWidth: '0' },
    remove: {
      position: 'relative',
      zIndex: '1',
      flexShrink: '0',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: toPx(c.tag.remove),
      height: toPx(c.tag.remove),
      me: toPx(-c.tag.removeOverhang),
      p: '0',
      borderWidth: '0',
      borderRadius: 'full',
      bg: 'transparent',
      color: 'text-muted',
      cursor: 'pointer',
      transitionProperty: 'background-color, color',
      transitionDuration: 'fast',
      // A 24px hit area around the 16px circle (WCAG 2.5.8), still inside the 28px pill.
      _after: { content: '""', position: 'absolute', inset: '[-4px]', borderRadius: 'full' }, // koi-web-only: a pseudo-element hit area,
      _hover: { bg: 'surface-muted', color: 'text' },
      _focusVisible: focusRing,
      '& > svg': { width: 'icon-sm', height: 'icon-sm' },
    },
  },
  variants: {
    // Hover lives in the same variant as the fill it changes: variants sort after base, so a hover rule in base would lose.
    selected: {
      false: {
        root: {
          bg: 'surface',
          borderColor: 'border',
          color: 'text',
          [`&:has(${TOGGLE}:hover)`]: { bg: 'surface-muted' },
        },
      },
      true: {
        root: {
          bg: 'action-subtle',
          borderColor: 'transparent',
          color: 'on-action-subtle',
          [`&:has(${TOGGLE}:hover)`]: { bg: 'action-subtle-hover' },
        },
        remove: { color: 'on-action-subtle', _hover: { bg: 'action-subtle-hover', color: 'on-action-subtle' } },
      },
    },
  },
  defaultVariants: { selected: false },
});
