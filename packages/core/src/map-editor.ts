import type { ReactNode } from 'react';
import type { CollectionEditorOwnProps, CollectionFieldRenderProps } from './collection-editor.js';

export interface MapEntry<K, V> {
  key: K;
  value: V;
}

export interface MapEditorOwnProps<K, V> extends CollectionEditorOwnProps {
  /** Controlled entries. Duplicate keys are allowed while editing; the row shows an error instead of dropping one. */
  value: MapEntry<K, V>[];
  onChange: (value: MapEntry<K, V>[]) => void;
  /** The entry a new row starts from, e.g. `() => ({ key: '', value: '' })`. */
  createEntry: () => MapEntry<K, V>;
  renderKey: (props: CollectionFieldRenderProps<K>) => ReactNode;
  renderValue: (props: CollectionFieldRenderProps<V>) => ReactNode;
  /** Extra per-key validation. A duplicate key reports "键名不能重复" first. */
  validateKey?: (key: K, entries: MapEntry<K, V>[], index: number) => string | undefined;
  /** Key equality for the duplicate check and row identity. Default Object.is. */
  keyEquals?: (a: K, b: K) => boolean;
  /** Value equality for row identity. Default Object.is. */
  valueEquals?: (a: V, b: V) => boolean;
}
