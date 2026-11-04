import { hasDuplicate, strings } from '@tuuject/koi-core';
import type { MapEditorOwnProps, MapEntry } from '@tuuject/koi-core';
import { type CollectionEditorSlot, collectionEditor } from '@tuuject/koi-react/styled-system/recipes';
import type { HTMLAttributes } from 'react';
import { CollectionEditor } from '../collection-editor/CollectionEditor.js';
import { useCollectionEntries } from '../collection-editor/useCollectionEntries.js';
import { Field } from '../field/Field.js';
import { ArrowRightIcon } from '../icons.js';
import type { SlotClassNames } from '../types.js';

export type { CollectionFieldRenderProps, MapEntry } from '@tuuject/koi-core';

export interface MapEditorProps<K, V>
  extends MapEditorOwnProps<K, V>,
    Omit<HTMLAttributes<HTMLDivElement>, keyof MapEditorOwnProps<K, V> | 'children'> {
  classNames?: SlotClassNames<CollectionEditorSlot>;
}

/**
 * Edits a list of key-value pairs: one row per entry, a key field, an arrow, a value field, and a remove button.
 * Rows drag by their handle and keep their identity while typing. Duplicate keys are kept and marked, never merged;
 * the app converts the array to a Map once it validates. With `sortable={false}` the handle disappears and the fields
 * take its place; the order of the array is left alone either way.
 */
export function MapEditor<K, V>({
  value,
  onChange,
  createEntry,
  renderKey,
  renderValue,
  validateKey,
  keyEquals = Object.is,
  valueEquals = Object.is,
  sortable = true,
  disabled,
  readOnly,
  addLabel = strings.addEntry,
  emptyText = strings.noEntries,
  className,
  classNames,
  ...rest
}: MapEditorProps<K, V>) {
  const sameEntry = (a: MapEntry<K, V>, b: MapEntry<K, V>) => keyEquals(a.key, b.key) && valueEquals(a.value, b.value);
  const { entries, update, add, remove, move } = useCollectionEntries(value, onChange, sameEntry);
  const s = collectionEditor({ layout: 'map', disabled });
  const data = entries.map((entry) => entry.data);

  // Duplicates win over custom validation: the value is kept, so the row has to say why it can't be saved.
  const keyError = (index: number): string | undefined => {
    if (
      hasDuplicate(
        data.map((entry) => entry.key),
        index,
        keyEquals,
      )
    ) {
      return strings.duplicateKey;
    }
    return validateKey?.(data[index].key, data, index) || undefined;
  };

  return (
    <CollectionEditor
      {...rest}
      entries={entries}
      layout="map"
      sortable={sortable}
      disabled={disabled}
      readOnly={readOnly}
      addLabel={addLabel}
      emptyText={emptyText}
      removeLabel={strings.removeEntry}
      onAdd={() => add(createEntry)}
      onRemove={remove}
      onMove={move}
      renderFields={(entry, index) => {
        const error = keyError(index);
        return (
          <>
            <Field error={error}>
              {renderKey({
                value: entry.data.key,
                onChange: (key) => update(entry.id, { ...entry.data, key }),
                disabled,
                readOnly,
                invalid: error !== undefined,
              })}
            </Field>
            <span className={s.arrow} aria-hidden="true">
              <ArrowRightIcon />
            </span>
            <Field>
              {renderValue({
                value: entry.data.value,
                onChange: (next) => update(entry.id, { ...entry.data, value: next }),
                disabled,
                readOnly,
              })}
            </Field>
          </>
        );
      }}
      className={className}
      classNames={classNames}
    />
  );
}
