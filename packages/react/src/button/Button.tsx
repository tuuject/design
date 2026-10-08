import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { button } from '@koi/react/styled-system/recipes';
import { useButtonShape, type ButtonShape } from '../shape';
import { Spinner } from '../spinner/Spinner';

export type ButtonColor = 'primary' | 'accent' | 'secondary' | 'warning' | 'error';
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

type NativeButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'color'>;
type NativeAnchorProps = Omit<React.ComponentPropsWithRef<'a'>, 'color' | 'type'>;

/**
 * Without `href`: a <button>, with every native button attribute.
 * With `href`: an <a> (a link that looks like a button), with every native anchor attribute.
 * A disabled or loading link renders a disabled <button> instead, as in legacy: an <a> can't be disabled.
 */
type AsButtonOrLink<Own> =
  | (Own & Omit<NativeButtonProps, keyof Own> & { href?: undefined })
  | (Own & Omit<NativeAnchorProps, keyof Own> & { href: string; disabled?: boolean; type?: never });

type OwnButtonProps = {
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
  /** Shows a Spinner in place of iconStart, disables the button and sets aria-busy. */
  loading?: boolean;
};

export type ButtonProps = AsButtonOrLink<OwnButtonProps>;

/** Renders <a> or <button> for Button and IconButton. */
function Pressable({ href, disabled, type = 'button', ...rest }: AsButtonOrLink<{}>) {
  if (href !== undefined && !disabled) return <a href={href} {...(rest as NativeAnchorProps)} />;
  // Drop the anchor-only attributes when a link falls back to a disabled <button>.
  const { target, rel, download, hrefLang, ping, referrerPolicy, ...buttonRest } = rest as NativeAnchorProps;
  return <button type={type} disabled={disabled} {...(buttonRest as NativeButtonProps)} />;
}

export function Button({
  color, variant, size, shape, iconStart, iconEnd, fullWidth, loading, disabled, className, children, ...rest
}: ButtonProps) {
  const resolvedShape = useButtonShape(shape);
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(button({ color, variant, size, shape: resolvedShape, fullWidth }), className)}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} label="处理中" /> : iconStart}
      <span>{children}</span>
      {iconEnd}
    </Pressable>
  );
}

type OwnIconButtonProps = Pick<OwnButtonProps, 'color' | 'variant' | 'size' | 'shape'> & {
  /** Required: the accessible name, also used as the native tooltip. */
  label: string;
  icon: React.ReactNode;
  children?: never;
};

export type IconButtonProps = AsButtonOrLink<OwnIconButtonProps>;

/** Square icon-only button. Defaults to secondary ghost, like the legacy IconButton. `href` makes it a link, as on Button. */
export function IconButton({ label, icon, color = 'secondary', variant = 'ghost', size, shape, className, ...rest }: IconButtonProps) {
  const resolvedShape = useButtonShape(shape);
  return (
    <Pressable
      {...rest}
      aria-label={label}
      title={label}
      className={cx(button({ color, variant, size, shape: resolvedShape, iconOnly: true }), className)}
    >
      {icon}
    </Pressable>
  );
}
