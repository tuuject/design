import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';

// docs/spec/components/ChatBubble.md. One element, no headless behavior. The anchor corner (the one nearest
// the sender) drops to radius-sm so a column of bubbles reads directionally; the rest stay radius-xl. The anchor
// corner is at the block end and the sender's inline side, so it follows the reading direction: a received bubble
// is anchored bottom-left in LTR and bottom-right in RTL.
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
        borderEndStartRadius: 'sm',
      },
      sent: {
        bg: 'action',
        color: 'on-action',
        borderEndEndRadius: 'sm',
      },
    },
  },
  defaultVariants: { side: 'received' },
});
