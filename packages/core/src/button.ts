import type { ReactNode } from 'react';
import type { ControlSize } from './common';

export const BUTTON_COLORS = ['primary', 'accent', 'secondary', 'warning', 'error'] as const;
export const BUTTON_VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
export type ButtonColor = (typeof BUTTON_COLORS)[number];
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
/** pill (radius-full) or rounded (radius-lg, 8px). */
export type ButtonShape = 'pill' | 'rounded';

export interface ButtonOwnProps {
  /** What the action means. Default primary. */
  color?: ButtonColor;
  /** How loud it is. Default solid. One solid button per group. */
  variant?: ButtonVariant;
  /** control-sm 28 · control-md 36 · control-lg 44. Default md. */
  size?: ControlSize;
  /** pill (radius-full) or rounded (radius-lg, 8px). Default pill, or whatever the surrounding ShapeProvider says. */
  shape?: ButtonShape;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
  /** Shows a Spinner in place of iconStart, disables the button and marks it busy. */
  loading?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

/** Square icon-only button. Defaults to secondary ghost. */
export interface IconButtonOwnProps extends Pick<ButtonOwnProps, 'color' | 'variant' | 'size' | 'shape' | 'disabled'> {
  /** Required: the accessible name, also used as the tooltip. */
  label: string;
  icon: ReactNode;
  children?: never;
}
