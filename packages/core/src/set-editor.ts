import type { ReactNode } from 'react';
import type { CollectionEditorOwnProps, CollectionFieldRenderProps } from './collection-editor.js';

export interface SetEditorOwnProps<T> extends CollectionEditorOwnProps {
  /** Controlled values. Duplicates are allowed while editing; the row shows an error instead of dropping one. */
  value: T[];
  onChange: (value: T[]) => void;
  /** The value a new row starts from, e.g. `() => ''`. */
  createValue: () => T;
  renderValue: (props: CollectionFieldRenderProps<T>) => ReactNode;
  /** Extra per-value validation. A duplicate reports "值不能重复" first. */
  validateValue?: (value: T, entries: T[], index: number) => string | undefined;
  /** Equality for the duplicate check and row identity. Default Object.is. */
  equals?: (a: T, b: T) => boolean;
}
