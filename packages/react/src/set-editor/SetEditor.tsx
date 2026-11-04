import { hasDuplicate, strings } from '@tuuject/koi-core';
import type { SetEditorOwnProps } from '@tuuject/koi-core';
import type { CollectionEditorSlot } from '@tuuject/koi-react/styled-system/recipes';
import type { HTMLAttributes } from 'react';
import { CollectionEditor } from '../collection-editor/CollectionEditor.js';
import { useCollectionEntries } from '../collection-editor/useCollectionEntries.js';
import { Field } from '../field/Field.js';
import type { SlotClassNames } from '../types.js';

export type { CollectionFieldRenderProps } from '@tuuject/koi-core';

export interface SetEditorProps<T>
  extends SetEditorOwnProps<T>,
    Omit<HTMLAttributes<HTMLDivElement>, keyof SetEditorOwnProps<T> | 'children'> {
  classNames?: SlotClassNames<CollectionEditorSlot>;
}

/**
 * Edits a list of unique values: one row per value, a drag handle, and a remove button.
 * Rows keep their identity while typing. Duplicates are kept and marked, never deduplicated; the app converts the
 * array to a Set once it validates. With `sortable={false}` the handle disappears and the field takes its place.
 */
export function SetEditor<T>({
  value,
  onChange,
  createValue,
  renderValue,
  validateValue,
  equals = Object.is,
  sortable = true,
  disabled,
  readOnly,
  addLabel = strings.addValue,
  emptyText = strings.noValues,
  className,
  classNames,
  ...rest
}: SetEditorProps<T>) {
  const { entries, update, add, remove, move } = useCollectionEntries(value, onChange, equals);
  const data = entries.map((entry) => entry.data);

  // Duplicates win over custom validation: the value is kept, so the row has to say why it can't be saved.
  const valueError = (index: number): string | undefined => {
    if (hasDuplicate(data, index, equals)) {
      return strings.duplicateValue;
    }
    return validateValue?.(data[index], data, index) || undefined;
  };

  return (
    <CollectionEditor
      {...rest}
      entries={entries}
      layout="set"
      sortable={sortable}
      disabled={disabled}
      readOnly={readOnly}
      addLabel={addLabel}
      emptyText={emptyText}
      removeLabel={strings.removeValue}
      onAdd={() => add(createValue)}
      onRemove={remove}
      onMove={move}
      renderFields={(entry, index) => {
        const error = valueError(index);
        return (
          <Field error={error}>
            {renderValue({
              value: entry.data,
              onChange: (next) => update(entry.id, next),
              disabled,
              readOnly,
              invalid: error !== undefined,
            })}
          </Field>
        );
      }}
      className={className}
      classNames={classNames}
    />
  );
}
