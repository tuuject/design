import type { ReactNode } from 'react';

export const PROSE_SIZES = ['sm', 'md'] as const;
export type ProseSize = (typeof PROSE_SIZES)[number];

export interface ProseOwnProps {
  children?: ReactNode;
  /**
   * The base size everything inside scales from: `md` (default) is 16px for articles and docs, `sm` is 14px for
   * rich text that sits among UI text (comments, descriptions, assistant replies in a dense panel).
   */
  size?: ProseSize;
}
