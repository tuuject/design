import { components as c } from '@koi/tokens/dimensions';
import { defineRecipe } from '@pandacss/dev';
import { toPx } from './dimensions';

// docs/spec/components/ChatBubble.md. One element, no headless behavior. The anchor corner (the one nearest
// the sender) drops to radius-sm so a column of bubbles reads directionally; the rest stay radius-xl.
export const chatBubble = defineRecipe({
  className: 'koi-chat-bubble',
  base: {
    display: 'inline-block',
    maxWidth: toPx(c.chatBubble.maxWidth),
    px: toPx(c.chatBubble.paddingX),
    py: toPx(c.chatBubble.paddingY),
    boxSizing: 'border-box',
    fontFamily: 'sans',
    textStyle: 'body',
    borderRadius: 'xl',
    overflowWrap: 'break-word',
  },
  variants: {
    side: {
      received: {
        bg: 'surface-muted',
        color: 'text',
        borderBottomLeftRadius: 'sm',
      },
      sent: {
        bg: 'action',
        color: 'on-action',
        borderBottomRightRadius: 'sm',
      },
    },
  },
  defaultVariants: { side: 'received' },
});
