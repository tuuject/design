import type { ReactNode } from 'react';

export const CHAT_BUBBLE_SIDES = ['received', 'sent'] as const;
export type ChatBubbleSide = (typeof CHAT_BUBBLE_SIDES)[number];

export interface ChatBubbleOwnProps {
  children: ReactNode;
  /**
   * Whose message it is. `sent` fills with `action` (and wants to sit on the right);
   * `received` (default) is a muted panel (and wants to sit on the left). Only the look:
   * alignment is the consumer's layout.
   */
  side?: ChatBubbleSide;
}
