import { arrayMove } from '@dnd-kit/sortable';
import { useId, useRef, useState } from 'react';

/** A row with the editor's own identity, so typing, reordering or an echoed `onChange` never remounts a field. */
export interface CollectionEntry<T> {
  id: string;
  data: T;
}

/**
 * Rows are an array on the outside (MapEditor / SetEditor semantics) and an id-carrying array on the inside.
 * `value` is reconciled only when its identity changes: an array that repeats the current rows keeps every id,
 * a genuinely new one keeps the ids of the entries it can match by value and gives the rest fresh ones.
 */
export function useCollectionEntries<T>(value: T[], onChange: (next: T[]) => void, same: (a: T, b: T) => boolean) {
  const prefix = useId();
  const counter = useRef(0);
  const makeId = () => `${prefix}-${counter.current++}`;

  const [entries, setEntries] = useState<CollectionEntry<T>[]>(() => value.map((data) => ({ id: makeId(), data })));
  const [seen, setSeen] = useState(value);
  // The array this hook last handed to onChange. When it comes back as `value`, it's our own edit echoed by the
  // parent: skip reconciliation, so rows keep their ids even while duplicate values make matching ambiguous.
  const emitted = useRef<T[] | null>(null);

  if (value !== seen) {
    setSeen(value);
    if (value !== emitted.current) {
      const next = reconcile(entries, value, same, makeId);
      if (next !== entries) {
        setEntries(next);
      }
    }
  }

  // Handlers read the rows from here, so two commits in one React batch still build on each other.
  const latest = useRef(entries);
  latest.current = entries;

  const commit = (next: CollectionEntry<T>[]) => {
    latest.current = next;
    setEntries(next);
    const data = next.map((entry) => entry.data);
    emitted.current = data;
    onChange(data);
  };

  return {
    entries,
    /** Writes a whole row (MapEditor keeps key and value in one object). */
    update(id: string, data: T) {
      commit(latest.current.map((entry) => (entry.id === id ? { id, data } : entry)));
    },
    add(create: () => T) {
      commit([...latest.current, { id: makeId(), data: create() }]);
    },
    remove(id: string) {
      commit(latest.current.filter((entry) => entry.id !== id));
    },
    /** Reorders by dnd-kit's active and over ids; called once, on drop. */
    move(activeId: string, overId: string) {
      const from = latest.current.findIndex((entry) => entry.id === activeId);
      const to = latest.current.findIndex((entry) => entry.id === overId);
      if (from < 0 || to < 0 || from === to) {
        return;
      }
      commit(arrayMove(latest.current, from, to));
    },
  };
}

/**
 * Keeps the ids of rows that still have the same value. The same index wins first, so an unchanged list keeps
 * its ids even when it comes back as a new array; otherwise the first unused equal entry wins.
 */
function reconcile<T>(
  prev: CollectionEntry<T>[],
  next: T[],
  same: (a: T, b: T) => boolean,
  makeId: () => string,
): CollectionEntry<T>[] {
  if (prev.length === next.length && prev.every((entry, index) => same(entry.data, next[index]))) {
    return prev;
  }
  const used = new Set<string>();
  return next.map((data, index) => {
    const at = prev[index];
    const match =
      at !== undefined && !used.has(at.id) && same(at.data, data)
        ? at
        : prev.find((entry) => !used.has(entry.id) && same(entry.data, data));
    if (match === undefined) {
      return { id: makeId(), data };
    }
    used.add(match.id);
    return { id: match.id, data };
  });
}
