import { createStrings, type Strings, type StringsOverride, strings as defaultStrings } from '@tuuject/koi-core';
import { type ReactNode, createContext, useContext, useMemo } from 'react';

export type { Strings, StringsOverride } from '@tuuject/koi-core';

export interface StringsProviderProps {
  /** Copy to replace. Every key is optional; the rest stays Koi's Simplified Chinese default. */
  strings: StringsOverride;
  children?: ReactNode;
}

const StringsContext = createContext<Strings>(defaultStrings);

/**
 * Replaces the copy every Koi component inside writes on its own: close buttons, loading spinners, pagination,
 * empty states, drag announcements. Pass only the keys the app translates. The merge is shallow, so a function
 * (`page`, `dragPickedUp`) is replaced whole. Mount it above ToastProvider: the provider reads this context where
 * it sits. Pass a stable object (hoist the literal) so its identity doesn't re-render every Koi child.
 */
export function StringsProvider({ strings: overrides, children }: StringsProviderProps) {
  const value = useMemo(() => createStrings(overrides), [overrides]);
  return <StringsContext.Provider value={value}>{children}</StringsContext.Provider>;
}

/** The copy table for the nearest StringsProvider, or Koi's Chinese defaults outside one. */
export function useStrings(): Strings {
  return useContext(StringsContext);
}
