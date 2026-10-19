import { type EffectCallback, useEffect } from 'react';

/** The one sanctioned effect: set up an external system on mount, tear it down on unmount. */
export function useMountEffect(effect: EffectCallback) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once by design
  useEffect(effect, []);
}
