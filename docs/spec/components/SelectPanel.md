# SelectPanel

A dropdown whose panel the consumer draws: grouped options, rich rows (an avatar, a second line, a badge), and an optional search box. The trigger looks exactly like Select.

**When to use:** when Select's native picker isn't enough: options in titled groups, rows that need more than a line of text, or lists long enough to need a search (roughly 15+ items). For a short plain list, use Select; it opens the platform picker on phones.

**The consumer supplies:** `items`, either options (`{value, label, disabled?}` plus any fields of their own) or groups of them (`{label, items}`), plus `value`/`onChange(value, details)` or `defaultValue`. Optionally `placeholder` (default "请选择"), `size`, `invalid`, `searchable` (with `searchPlaceholder`, default "搜索", and `emptyText`, default "无匹配项"), `renderValue(item)` for the trigger, and `children`.
- `children` is a function that receives the options to show, in the shape `items` has, already filtered by the search (groups left empty are dropped). It returns the panel: each option as a `SelectItem` (`value`, and `label` for type-to-find when its content isn't plain text), optionally inside `SelectGroup` (`label`) and between `SelectSeparator`s, around any markup.
- Without `children`, every option is a `SelectItem` and every group a `SelectGroup`.

**Behavior:** Base UI Select (a listbox) without `searchable`, Base UI Combobox with its input inside the panel with it. Either way: the panel opens below the trigger (flipping above near the viewport edge), at least as wide as the trigger; ↓ / Enter / Space open it, arrow keys move, Enter chooses, Esc closes and returns focus to the trigger. Disabled options can't be chosen.

**Styling:**
- Trigger: identical to Select and Input (`surface`, 1px `border-control`, `radius-xl`, the three control heights); the edge stays `focus-ring` while the panel is open, and the chevron turns over on the spring curve.
- Panel: `surface`, a 1px `border` edge, `radius-xl`, `shadow-float`, 4px padding, at most 360px tall (it scrolls). It pops in from the trigger (scale from 96% on the spring curve, fade on `out`).
- Options: 36px tall, `body` type, `radius-lg` (concentric with the panel). The highlighted option fills `surface-muted`; the chosen one shows a 16px check in `text-brand`; disabled ones are `text-disabled`.
- Group labels: `small` `text-muted`. Separators: 1px `divider`, edge to edge.
- Search: a 36px row with a 16px search icon and a borderless input, a `divider` line under it. Focus stays in it while the arrow keys move the highlight.
