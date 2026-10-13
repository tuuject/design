/**
 * The second argument of Koi's change callbacks (`onCheckedChange`, `onChange`, `onOpenChange`). Koi's own type,
 * not a headless library's (docs/headless.md, rule 5). `E` is the platform's event: `Event` on the web, a
 * gesture or press event on native.
 */
export interface ChangeDetails<E = unknown> {
  /**
   * What caused the change, e.g. `'trigger-press'`, `'escape-key'`. The values come from the headless library and
   * can differ between versions and platforms: log them or branch on them loosely, don't rely on an exact list.
   */
  reason: string;
  /** The platform event behind the change. */
  event: E;
  /** Rejects the change: the component keeps its current value (or stays open / closed). */
  cancel(): void;
}
