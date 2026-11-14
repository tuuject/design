import {
  DirectionProvider as BaseDirectionProvider,
  useDirection as useBaseDirection,
} from '@base-ui/react/direction-provider';
import type { Direction } from '@tuuject/koi-core';
import { type ReactNode, createContext, useContext } from 'react';

export type { Direction } from '@tuuject/koi-core';

export interface DirectionProviderProps {
  /** Reading direction of everything inside. Default 'ltr'. */
  direction?: Direction;
  children?: ReactNode;
}

// What this provider was given, or null outside one. Base UI's own context always answers ('ltr' by default), so it
// can't tell "the app asked for ltr" from "nobody said"; portalled content needs that difference (see below).
const ProvidedDirectionContext = createContext<Direction | null>(null);

/**
 * Tells Koi (and Base UI) which way its behaviour should read: floating panel placement, the arrow keys in Tabs,
 * Menu, RadioGroup and Slider, and the `dir` Koi writes on its portalled panels.
 *
 * It renders no element of its own, exactly like Base UI's provider. CSS direction comes from the `dir` attribute,
 * which the app puts on `<html>` (with a matching `lang`) or on the root of the subtree it scopes. Both are needed
 * and they do different jobs: `dir` for the browser (bidi text, `:dir()`, logical properties, hyphenation, font
 * fallback), this provider for component behaviour that no CSS property can express.
 *
 * ```tsx
 * // <html dir="rtl" lang="ar"> — or a <div dir="rtl" lang="ar"> around an RTL region
 * <DirectionProvider direction="rtl">
 *   <App />
 * </DirectionProvider>
 * ```
 *
 * A portal lands in `document.body`, outside any `dir` a subtree root sets, so each floating component writes the
 * provider's direction onto its own Positioner/Viewport (`useDirectionAttr()`).
 */
export function DirectionProvider({ direction = 'ltr', children }: DirectionProviderProps) {
  return (
    <BaseDirectionProvider direction={direction}>
      <ProvidedDirectionContext.Provider value={direction}>{children}</ProvidedDirectionContext.Provider>
    </BaseDirectionProvider>
  );
}

/**
 * The reading direction components reason about: whatever the nearest `DirectionProvider` says, directly or through
 * Base UI. 'ltr' outside one, like Base UI. Styling never reads this — CSS logical properties and `:dir()` do that
 * job; a placement's alignment can't be written as CSS, so the positioner gets this direction as its `dir`.
 */
export function useDirection(): Direction {
  return useBaseDirection();
}

/**
 * The `dir` attribute to write on portalled content, or undefined when no Koi `DirectionProvider` is above it. A
 * portal lands in `document.body`, outside the `dir` a subtree root sets: without this, a scoped direction would be
 * lost on the panel. Undefined (rather than `useDirection()`'s 'ltr') is deliberate — writing `dir="ltr"` inside an
 * RTL document would flip the panel back, so when the app only sets `<html dir>` the panel inherits it and stays quiet.
 */
export function useDirectionAttr(): Direction | undefined {
  return useContext(ProvidedDirectionContext) ?? undefined;
}
