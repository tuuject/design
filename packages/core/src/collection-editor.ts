/** What a row field's render prop receives. The editor owns the error text; `invalid` lets a custom control show the same state. */
export interface CollectionFieldRenderProps<T> {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  readOnly?: boolean;
  /** The field has an error. Koi's Input, Textarea and Select take `invalid`. */
  invalid?: boolean;
}

/** What MapEditor and SetEditor share. */
export interface CollectionEditorOwnProps {
  /** Drag rows by a handle. Default true; turn it off when the order has no meaning. */
  sortable?: boolean;
  /** Disables every control, the drag handle included. */
  disabled?: boolean;
  /** Keeps the rows but drops add, remove and reorder; fields get `readOnly`. */
  readOnly?: boolean;
  /** Add button text. Defaults to "添加条目" (MapEditor) or "添加值" (SetEditor). */
  addLabel?: string;
  /** Shown instead of the rows when there are none. */
  emptyText?: string;
}

/** True when another entry carries an equal value. Pure: the editors use it for the duplicate error. */
export function hasDuplicate<T>(values: T[], index: number, equals: (a: T, b: T) => boolean = Object.is): boolean {
  return values.some((value, i) => i !== index && equals(value, values[index]));
}
