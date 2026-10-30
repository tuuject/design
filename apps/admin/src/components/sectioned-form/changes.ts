import { type FieldErrors, get } from 'react-hook-form';
import type { FieldEntry } from './outline';

/** A dirty or invalid field as the navigation, the action bar and the change summary show it. Never its value. */
export interface FieldMark {
  name: string;
  label: string;
  /** Null for a path no FormField declares (set with setValue, say): it is counted, but has nowhere to go. */
  sectionId: string | null;
  mounted: boolean;
}

/**
 * Which fields differ from the baseline and which fail validation, read from react-hook-form's own state:
 * `dirtyFields` already applies its field identity and deep comparison (a field typed back to its baseline is
 * dropped from it), so nothing here compares values.
 */
export function collectMarks(fields: readonly FieldEntry[], dirtyFields: object, errors: FieldErrors) {
  return {
    dirty: mark(fields, dirtyPaths(dirtyFields), (name) => hasTrue(get(dirtyFields, name))),
    invalid: mark(fields, errorPaths(errors), (name) => get(errors, name) != null),
  };
}

function mark(fields: readonly FieldEntry[], paths: string[], test: (name: string) => boolean): FieldMark[] {
  const covered = (path: string) => fields.some((f) => path === f.name || path.startsWith(`${f.name}.`));
  return [
    ...fields.filter((f) => test(f.name)),
    ...paths.filter((p) => !covered(p)).map((p) => ({ name: p, label: p, sectionId: null, mounted: false })),
  ];
}

// A registered field is `true` in dirtyFields; an object or array value set without a field of its own is
// marked per leaf instead.
function hasTrue(node: unknown): boolean {
  return node === true || (typeof node === 'object' && node !== null && Object.values(node).some(hasTrue));
}

function dirtyPaths(node: unknown, prefix = ''): string[] {
  if (node === true) {
    return [prefix];
  }
  if (typeof node !== 'object' || node === null) {
    return [];
  }
  return Object.entries(node).flatMap(([key, child]) => dirtyPaths(child, prefix ? `${prefix}.${key}` : key));
}

function errorPaths(node: unknown, prefix = ''): string[] {
  if (typeof node !== 'object' || node === null) {
    return [];
  }
  // A FieldError: stop here rather than walk into its `ref` element.
  if (typeof (node as { type?: unknown }).type === 'string') {
    return [prefix];
  }
  return Object.entries(node).flatMap(([key, child]) =>
    // The form-level `root` error (a failed save) belongs to no field.
    !prefix && key === 'root' ? [] : errorPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

/**
 * Paths whose value differs between two snapshots of the form values: the edits made while a save was in flight.
 * Plain objects are walked; anything else (arrays included) compares as one value.
 */
export function changedPaths(before: unknown, after: unknown, prefix = ''): string[] {
  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((key) => changedPaths(before[key], after[key], prefix ? `${prefix}.${key}` : key));
  }
  return isEqual(before, after) ? [] : [prefix];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false;
  }
  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }
  const keysA = Object.keys(a);
  return (
    keysA.length === Object.keys(b).length &&
    keysA.every((key) => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]))
  );
}
