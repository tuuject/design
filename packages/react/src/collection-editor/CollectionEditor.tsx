import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { type CollectionEditorSlot, collectionEditor } from '@tuuject/koi-react/styled-system/recipes';
import { type HTMLAttributes, type ReactNode, useRef } from 'react';
import { Button, IconButton } from '../button/Button.js';
import { GripVerticalIcon, PlusIcon, TrashIcon } from '../icons.js';
import { useStrings } from '../strings.js';
import type { SlotClassNames } from '../types.js';
import type { CollectionEntry } from './useCollectionEntries.js';

interface CollectionEditorArgs<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  entries: CollectionEntry<T>[];
  layout: 'map' | 'set';
  sortable: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  addLabel: string;
  emptyText: string;
  removeLabel: string;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMove: (activeId: string, overId: string) => void;
  renderFields: (entry: CollectionEntry<T>, index: number) => ReactNode;
  classNames?: SlotClassNames<CollectionEditorSlot>;
}

/**
 * The rows, handle, remove and add button MapEditor and SetEditor share. Internal: consumers get one of the two
 * editors, never a generic collection editor (their data semantics are the point).
 * Reordering is committed once, on drop; dragging never calls onChange.
 */
export function CollectionEditor<T>({
  entries,
  layout,
  sortable,
  disabled,
  readOnly,
  addLabel,
  emptyText,
  removeLabel,
  onAdd,
  onRemove,
  onMove,
  renderFields,
  className,
  classNames,
  ...rest
}: CollectionEditorArgs<T>) {
  const t = useStrings();
  const s = collectionEditor({ layout, disabled });
  // A slot recipe returns class strings; the dragged row's lift is the same recipe with `dragging` on.
  const rowClass = s.row;
  const draggingRowClass = collectionEditor({ layout, disabled, dragging: true }).row;
  const canSort = sortable && !readOnly;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Announcements say where the row moved; ids are mapped back to their current position when they fire.
  const rows = useRef(entries);
  rows.current = entries;
  const position = (id: UniqueIdentifier) => {
    const index = rows.current.findIndex((entry) => entry.id === id);
    return index < 0 ? 1 : index + 1;
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over !== null && active.id !== over.id) {
      onMove(String(active.id), String(over.id));
    }
  };

  const renderRow = (entry: CollectionEntry<T>, index: number) => {
    const fields = <div className={cx(s.fields, classNames?.fields)}>{renderFields(entry, index)}</div>;
    const remove =
      readOnly === true ? null : (
        <IconButton
          label={removeLabel}
          icon={<TrashIcon />}
          color="error"
          variant="ghost"
          className={cx(s.remove, classNames?.remove)}
          onClick={() => onRemove(entry.id)}
          disabled={disabled}
        />
      );
    return canSort ? (
      <SortableRow
        key={entry.id}
        id={entry.id}
        disabled={disabled}
        rowClass={(dragging) => (dragging ? draggingRowClass : rowClass)}
        handleClass={cx(s.handle, classNames?.handle)}
      >
        {fields}
        {remove}
      </SortableRow>
    ) : (
      <li key={entry.id} className={s.row}>
        {fields}
        {remove}
      </li>
    );
  };

  const list = <ul className={cx(s.list, classNames?.list)}>{entries.map(renderRow)}</ul>;

  return (
    <div {...rest} className={cx(s.root, className)}>
      {entries.length === 0 ? (
        <p className={cx(s.empty, classNames?.empty)}>{emptyText}</p>
      ) : canSort ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
          accessibility={{
            announcements: {
              onDragStart: ({ active }) => t.dragPickedUp(position(active.id)),
              onDragOver: ({ active, over }) =>
                over === null || over.id === active.id
                  ? t.dragPickedUp(position(active.id))
                  : t.dragMoved(position(over.id)),
              onDragEnd: ({ over }) => (over === null ? t.dragCanceled : t.dragDropped(position(over.id))),
              onDragCancel: () => t.dragCanceled,
            },
            screenReaderInstructions: { draggable: t.dragInstructions },
          }}
        >
          <SortableContext items={entries.map((entry) => entry.id)} strategy={verticalListSortingStrategy}>
            {list}
          </SortableContext>
        </DndContext>
      ) : (
        list
      )}
      {readOnly === true ? null : (
        <Button
          variant="ghost"
          color="secondary"
          iconStart={<PlusIcon />}
          className={cx(s.add, classNames?.add)}
          onClick={onAdd}
          disabled={disabled}
        >
          {addLabel}
        </Button>
      )}
    </div>
  );
}

interface SortableRowProps {
  id: string;
  disabled?: boolean;
  rowClass: (dragging: boolean) => string;
  handleClass: string;
  children: ReactNode;
}

function SortableRow({ id, disabled, rowClass, handleClass, children }: SortableRowProps) {
  const t = useStrings();
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
    attributes: { roleDescription: t.sortableItem },
  });

  return (
    <li
      ref={setNodeRef}
      // dnd-kit's own transform and transition; the row keeps its height, so its siblings slide rather than jump.
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={rowClass(isDragging)}
    >
      <IconButton
        ref={setActivatorNodeRef}
        label={t.dragToReorder}
        icon={<GripVerticalIcon />}
        className={handleClass}
        disabled={disabled}
        {...attributes}
        {...listeners}
      />
      {children}
    </li>
  );
}
