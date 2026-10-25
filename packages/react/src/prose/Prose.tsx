import type { ProseOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { prose } from '@koi/react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';

export type { ProseSize } from '@koi/core';

export interface ProseProps extends ProseOwnProps, Omit<ComponentPropsWithRef<'div'>, keyof ProseOwnProps> {}

/**
 * Styles rendered rich text (markdown output, CMS HTML) in Koi's long-form type. Everything inside is sized in em,
 * so `size` (or the consumer's own font size) scales the whole block. Wrap embedded components in `koi-not-prose`.
 */
export function Prose({ size = 'md', className, ...rest }: ProseProps) {
  return <div {...rest} className={cx(prose({ size }), className)} />;
}
