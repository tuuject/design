import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { toPx } from './dimensions';

// Port of .koi-avatar in reference/legacy-web/components/bundle.css and docs/spec/components/Avatar.md.
// Base UI renders either the image (once it has loaded) or the fallback initials inside the root.
export const avatar = defineSlotRecipe({
  className: 'koi-avatar',
  slots: ['root', 'image', 'fallback'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      verticalAlign: 'middle',
      overflow: 'hidden',
      boxSizing: 'border-box',
      borderRadius: 'full',
      // Behind a transparent image too, as in legacy.
      bg: 'action-subtle',
      color: 'on-action-subtle',
      fontFamily: 'sans',
      fontWeight: '700',
      lineHeight: '1',
      userSelect: 'none',
    },
    image: { display: 'block', width: '100%', height: '100%', objectFit: 'cover' },
    fallback: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      whiteSpace: 'nowrap',
    },
  },
  variants: {
    size: {
      sm: { root: { width: 'control-sm', height: 'control-sm', fontSize: toPx(c.avatar.fontSm) } },
      md: { root: { width: 'control-md', height: 'control-md', fontSize: toPx(c.avatar.fontMd) } },
      lg: { root: { width: 'control-lg', height: 'control-lg', fontSize: toPx(c.avatar.fontLg) } },
      xl: { root: { width: toPx(c.avatar.sizeXl), height: toPx(c.avatar.sizeXl), fontSize: toPx(c.avatar.fontXl) } },
    },
    shape: {
      circle: {},
      square: { root: { borderRadius: 'xl' } },
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
});
