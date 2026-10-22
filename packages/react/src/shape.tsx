import type { ButtonShape } from '@koi/core';
import { type ReactNode, createContext, useContext } from 'react';

export type { ButtonShape };

/**
 * The default button shape for a surface. Buttons are rounded (8px) unless a container says
 * otherwise; wrap a page in `shape="pill"` for the blog's pill voice. Dialog's footer and table
 * cells still provide "rounded" themselves, so they stay rounded inside a pill page: the dialog's
 * 32px radius = 8px button radius + 24px padding (concentric corners), and row actions need the
 * dense shape. An explicit `shape` prop on a Button always wins.
 */
export const ShapeContext = createContext<ButtonShape | null>(null);

export function ShapeProvider({ shape, children }: { shape: ButtonShape; children: ReactNode }) {
  return <ShapeContext.Provider value={shape}>{children}</ShapeContext.Provider>;
}

export function useButtonShape(explicit?: ButtonShape): ButtonShape {
  const fromContext = useContext(ShapeContext);
  return explicit ?? fromContext ?? 'rounded';
}
