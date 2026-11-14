import type { ButtonOwnProps, IconButtonOwnProps } from '@tuuject/koi-core';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import { button } from '@tuuject/koi-react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';
import { useButtonShape } from '../shape.js';
import { Spinner } from '../spinner/Spinner.js';
import { useStrings } from '../strings.js';

export type { ButtonColor, ButtonVariant } from '@tuuject/koi-core';

type NativeButtonProps = Omit<ComponentPropsWithRef<'button'>, 'color'>;
type NativeAnchorProps = Omit<ComponentPropsWithRef<'a'>, 'color' | 'type'>;

/**
 * Without `href`: a <button>, with every native button attribute.
 * With `href`: an <a> (a link that looks like a button), with every native anchor attribute.
 * A disabled or loading link renders a disabled <button> instead, as in legacy: an <a> can't be disabled.
 */
type AsButtonOrLink<Own> =
  | (Own & Omit<NativeButtonProps, keyof Own> & { href?: undefined })
  | (Own & Omit<NativeAnchorProps, keyof Own> & { href: string; disabled?: boolean; type?: never });

export type ButtonProps = AsButtonOrLink<ButtonOwnProps>;

// The label is a flex item between the icons: its automatic minimum width is its longest word, so it needs
// `min-width: 0` to shrink and `anywhere` to make one unbreakable word breakable (`break-word` only breaks at line
// time, and doesn't change min-content). Hyphenation follows the page's `lang`, so German breaks at syllables.
const labelStyle = css({ minWidth: '0', overflowWrap: 'anywhere', hyphens: 'auto' });

/** Renders <a> or <button> for Button and IconButton. */
function Pressable({ href, disabled, type = 'button', ...rest }: AsButtonOrLink<Record<never, never>>) {
  if (href !== undefined && !disabled) {
    return <a href={href} {...(rest as NativeAnchorProps)} />;
  }
  // Drop the anchor-only attributes when a link falls back to a disabled <button>.
  const { target, rel, download, hrefLang, ping, referrerPolicy, ...buttonRest } = rest as NativeAnchorProps;
  return <button type={type} disabled={disabled} {...(buttonRest as NativeButtonProps)} />;
}

export function Button({
  color,
  variant,
  size,
  shape,
  iconStart,
  iconEnd,
  fullWidth,
  loading,
  loadingLabel,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const resolvedShape = useButtonShape(shape);
  const t = useStrings();
  return (
    <Pressable
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(button({ color, variant, size, shape: resolvedShape, fullWidth }), className)}
    >
      {loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} label={loadingLabel ?? t.processing} /> : iconStart}
      <span className={labelStyle}>{children}</span>
      {iconEnd}
    </Pressable>
  );
}

export type IconButtonProps = AsButtonOrLink<IconButtonOwnProps>;

/** Square icon-only button. Defaults to secondary ghost, like the legacy IconButton. `href` makes it a link, as on Button. */
export function IconButton({
  label,
  icon,
  color = 'secondary',
  variant = 'ghost',
  size,
  shape,
  className,
  ...rest
}: IconButtonProps) {
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
