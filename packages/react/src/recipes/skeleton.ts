import { defineRecipe } from '@pandacss/dev';

// Port of .koi-skeleton in reference/legacy-web/components/bundle.css and docs/spec/components/Skeleton.md.
// Only the fill and the shimmer: width, height, radius and layout come from the consumer.
export const skeleton = defineRecipe({
  className: 'koi-skeleton',
  base: {
    backgroundColor: 'skeleton',
    backgroundImage: 'linear-gradient(100deg, transparent 40%, token(colors.skeleton-highlight) 50%, transparent 60%)',
    // Painted against the viewport, so every skeleton on the page sweeps as one band whatever its size.
    // iOS Safari ignores fixed backgrounds; there each skeleton shimmers on its own.
    backgroundSize: '200vw 100%',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    animationName: 'koi-shimmer',
    animationDuration: 'shimmer',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    // Children only size the skeleton. Legacy hid element children alone; transparent text also hides bare text.
    color: 'transparent',
    '& > *': { visibility: 'hidden' },
    '@media (prefers-reduced-motion: reduce)': { animationName: 'none', backgroundImage: 'none' },
  },
});
