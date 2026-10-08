// Motion values live in the brand book (docs/spec/README.md, "Motion") but not yet in tokens.json.
// TODO: move them into src/tokens.json and the design-system artifact, then delete this file.
export const motion = {
  easings: { spring: 'cubic-bezier(.47,1.64,.41,.8)', out: 'cubic-bezier(0, 0, .2, 1)' },
  durations: { fast: '150ms', overlay: '200ms', check: '250ms', spring: '400ms', shimmer: '1.6s' },
};

export const keyframes = {
  'koi-fade': { from: { opacity: '0' } },
  'koi-pop': { from: { opacity: '0', transform: 'translateY(8px) scale(.97)' } },
  'koi-rise': { from: { opacity: '0', transform: 'translateY(12px) scale(.96)' } },
  'koi-spin': { to: { transform: 'rotate(360deg)' } },
  'koi-shimmer': { from: { backgroundPosition: '-150vw 0' }, to: { backgroundPosition: '50vw 0' } },
};
