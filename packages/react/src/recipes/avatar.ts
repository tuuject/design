import { defineSlotRecipe } from '@pandacss/dev';

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
      sm: { root: { width: 'control-sm', height: 'control-sm', fontSize: '[12px]' } },
      md: { root: { width: 'control-md', height: 'control-md', fontSize: '[14px]' } },
      lg: { root: { width: 'control-lg', height: 'control-lg', fontSize: '[16px]' } },
      xl: { root: { width: '[64px]', height: '[64px]', fontSize: '[24px]' } },
    },
    shape: {
      circle: {},
      square: { root: { borderRadius: 'xl' } },
    },
  },
  defaultVariants: { size: 'md', shape: 'circle' },
});
