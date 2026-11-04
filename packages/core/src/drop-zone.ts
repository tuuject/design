import type { ReactNode } from 'react';

export interface DropZoneOwnProps {
  /** Heading inside the area. Default "拖拽文件到这里，或点击选择". */
  title?: ReactNode;
  /** Secondary line under the heading, e.g. the accepted formats. */
  description?: ReactNode;
  /** Replaces the default upload glyph. */
  icon?: ReactNode;
  /** Passed to the platform picker, e.g. `"image/png,image/webp"`. */
  accept?: string;
  /** Allow more than one file at a time. Default true. */
  multiple?: boolean;
  disabled?: boolean;
}
