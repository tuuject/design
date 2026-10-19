import type { ButtonShape } from '@koi/core';
import * as React from 'react';

export type { ButtonShape };

/**
 * The default button shape for a surface. Buttons are pills everywhere except where a
 * container says otherwise: Dialog's footer provides "rounded" (8px), because the dialog's
 * 32px radius = 8px button radius + 24px padding (concentric corners); table cells provide it
 * too, the dense shape for row actions. An explicit `shape` prop on a Button always wins.
 */
const ShapeContext = React.createContext<ButtonShape | null>(null);

export function ShapeProvider({ shape, children }: { shape: ButtonShape; children: React.ReactNode }) {
  return <ShapeContext.Provider value={shape}>{children}</ShapeContext.Provider>;
}

export function useButtonShape(explicit?: ButtonShape): ButtonShape {
  const fromContext = React.useContext(ShapeContext);
  return explicit ?? fromContext ?? 'pill';
}
