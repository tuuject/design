import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { button } from '@koi/react/styled-system/recipes';
import { strings, type ButtonOwnProps, type IconButtonOwnProps } from '@koi/core';
import { useButtonShape } from '../shape';
import { Spinner } from '../spinner/Spinner';

export type { ButtonColor, ButtonVariant } from '@koi/core';

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

export type ButtonProps = AsButtonOrLink<ButtonOwnProps>;

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
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} label={strings.processing} /> : iconStart}
      <span>{children}</span>
      {iconEnd}
    </Pressable>
  );
}

export type IconButtonProps = AsButtonOrLink<IconButtonOwnProps>;

/** Square icon-only button. Defaults to secondary ghost, like the legacy IconButton. `href` makes it a link, as on Button. */
export function IconButton({ label, icon, color = 'secondary', variant = 'ghost', size, shape, className, ...rest }: IconButtonProps) {
  const resolvedShape = useButtonShape(shape);
  return (
    <Pressable
      // Before the spread so a passed title wins; Tooltip passes title={undefined} so the native one doesn't stack on it.
      title={label}
      {...rest}
      aria-label={label}
      className={cx(button({ color, variant, size, shape: resolvedShape, iconOnly: true }), className)}
    >
      {icon}
    </Pressable>
  );
}
