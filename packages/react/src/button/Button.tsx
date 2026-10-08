import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { button } from '@koi/react/styled-system/recipes';
import { useButtonShape, type ButtonShape } from '../shape';

export type ButtonColor = 'primary' | 'accent' | 'secondary' | 'warning' | 'error';
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<React.ComponentPropsWithRef<'button'>, 'color'> {
  /** What the action means. Default primary. */
  color?: ButtonColor;
  /** How loud it is. Default solid. One solid button per group. */
  variant?: ButtonVariant;
  /** control-sm 28 · control-md 36 · control-lg 44. Default md. */
  size?: Size;
  /** pill (radius-full) or rounded (radius-lg, 8px). Default pill, or whatever the surrounding ShapeProvider says. */
  shape?: ButtonShape;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
  /** Disables the button and sets aria-busy. TODO: show a Spinner in place of iconStart (see legacy bundle.js). */
  loading?: boolean;
}

export function Button({
  color, variant, size, shape, iconStart, iconEnd, fullWidth, loading, disabled, className, children, type = 'button', ...rest
}: ButtonProps) {
  const resolvedShape = useButtonShape(shape);
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(button({ color, variant, size, shape: resolvedShape, fullWidth }), className)}
      {...rest}
    >
      {iconStart}
      <span>{children}</span>
      {iconEnd}
    </button>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, 'iconStart' | 'iconEnd' | 'children' | 'fullWidth'> {
  /** Required: the accessible name, also used as the native tooltip. */
  label: string;
  icon: React.ReactNode;
}

/** Square icon-only button. Defaults to secondary ghost, like the legacy IconButton. */
export function IconButton({ label, icon, color = 'secondary', variant = 'ghost', size, shape, className, ...rest }: IconButtonProps) {
  const resolvedShape = useButtonShape(shape);
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(button({ color, variant, size, shape: resolvedShape, iconOnly: true }), className)}
      {...rest}
    >
      {icon}
    </button>
  );
}
