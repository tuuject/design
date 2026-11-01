import type { ChatBubbleOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { chatBubble } from '@tuuject/koi-react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';

export type { ChatBubbleSide } from '@tuuject/koi-core';

export interface ChatBubbleProps
  extends ChatBubbleOwnProps,
    Omit<ComponentPropsWithRef<'div'>, keyof ChatBubbleOwnProps | 'children'> {}

/** A chat or comment message: `received` is a muted panel, `sent` the filled action color. */
export function ChatBubble({ side = 'received', className, ...rest }: ChatBubbleProps) {
  return <div {...rest} className={cx(chatBubble({ side }), className)} />;
}
