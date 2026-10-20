import type { ChangeDetails as CoreChangeDetails } from '@koi/core';

/**
 * The second argument of Koi's change callbacks on the web: `ChangeDetails` from @koi/core with a DOM `Event`.
 * Base UI's own details object already satisfies it, so it's passed straight through (agent-doc/headless.md, rule 5).
 */
export type ChangeDetails = CoreChangeDetails<Event>;

/**
 * Extra classes for a component's inner elements, keyed by its recipe's slot names (`CardSlot`, …), so
 * consumers can restyle parts that `className` can't reach. The root keeps `className`.
 */
export type SlotClassNames<Slot extends string> = Partial<Record<Exclude<Slot, 'root'>, string>>;
