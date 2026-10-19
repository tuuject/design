import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { type AvatarOwnProps, initials, strings } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { avatar } from '@koi/react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';

export type { AvatarShape, AvatarSize } from '@koi/core';

export interface AvatarProps
  extends AvatarOwnProps,
    Omit<ComponentPropsWithRef<'span'>, keyof AvatarOwnProps | 'children'> {}

/** A round (or rounded-square) picture of a person or site. Base UI swaps in the image once it has loaded. */
export function Avatar({ src, name, size = 'md', shape = 'circle', className, ...rest }: AvatarProps) {
  const s = avatar({ size, shape });
  return (
    // role="img" + aria-label names it the same way whether the image or the initials show.
    <BaseAvatar.Root role="img" aria-label={name || strings.avatar} {...rest} className={cx(s.root, className)}>
      {src ? <BaseAvatar.Image src={src} alt="" className={s.image} /> : null}
      <BaseAvatar.Fallback aria-hidden="true" className={s.fallback}>
        {initials(name)}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
