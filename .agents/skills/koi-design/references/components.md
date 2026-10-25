# Choosing and using components

Use a component before styling a `div`. For how a chosen component looks and behaves, read `docs/spec/components/<Name>.md`; this file only helps pick one.

## Which component

| Need | Use | Not |
| --- | --- | --- |
| Any action | Button (`color` = meaning, `variant` = loudness) | a styled link |
| Link inside running text | Link (amber, dashed) | Button |
| Quiet standalone action | Button `ghost` | Link |
| Compact familiar action | IconButton (+ Tooltip if unclear) | an unlabeled icon |
| Status or count, not clickable | Badge | Tag |
| Keyword, filter chip, removable value | Tag | Badge |
| Persistent message tied to content | Alert | Toast |
| Quick confirmation that disappears | Toast | Alert |
| Decision needing full attention | Dialog (`role="alertdialog"` for confirms) | Toast, inline content |
| Field-level problem | Field `error` | Alert |
| Setting that applies immediately | Switch | Checkbox |
| Choice applied by a Save button | Checkbox | Switch |
| 2–5 visible exclusive options | RadioGroup | Select |
| Short list (≤ ~15) | Select (native) | SelectPanel |
| Groups, rich rows, search | SelectPanel | Select |
| 2–6 peer views of one content | Tabs | Tabs for page navigation |
| App navigation | NavMenu (not yet ported; Admin has a stopgap Sidebar) | Tabs |
| Known layout, unknown data | Skeleton | Spinner |
| Short unmeasured wait | Spinner | Progress |
| Measurable work | Progress | Spinner |
| Records to scan across columns | DataTable, or Table parts for sort / selection | a grid of cards |
| Rendered markdown / rich HTML | Prose (`md` 16px for articles, `sm` 14px among UI text) | hand-styling `h1`/`ul`/`code` |
| Grouping related content | Card (`outlined` / `filled`; `glass` only over imagery) | a hand-drawn bordered box |

Not in Koi yet: dropdown Menu, Popover, date picker, free-text autocomplete, Slider, Sheet. The Admin template uses Base UI's Menu directly for its user menu, styled like SelectPanel's panel (`agent-doc/admin.md`). A new one needs a spec before it ships in the library.

## Buttons

- `color`: `primary` (main action), `accent` (one highlight per view), `secondary` (cancel / back / close), `warning` (consequences worth a second look), `error` (destructive, usually confirmed in a Dialog).
- `variant`: `solid` > `soft` > `outline` > `ghost`. **One solid per group.** Never two solids side by side.
- Labels are short Chinese verbs on one line. Don't signal danger by color alone; say it ("删除").
- Dialog footer order: cancel (`secondary ghost`), then the confirming solid (`primary`, or `error` when it destroys something).
- Table row actions: `sm ghost` Buttons with no gap between them, end-aligned, the group pulled 8px outward so the last label lines up with the header. Icon-only row actions are `md` IconButtons in a `paddingBlock="none"` cell.

## Forms

- Wrap every control in a Field; stack Fields `space-4` apart.
- Mark optional fields "（选填）" rather than starring every required one, unless most fields are optional.
- Errors go in the Field's `error`, written as the fix.
- Don't use a placeholder as a label.
