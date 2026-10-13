# Headless layer

Koi draws its components; a headless library (Base UI today) gives them behavior and accessibility. These rules keep that library replaceable, so a Solid package on Kobalte (or a Base UI major upgrade) can reuse the recipes and the props API instead of forking them.

## Three layers

| Layer | Where | May know the headless library? |
| --- | --- | --- |
| Recipes and global styles | `packages/react/src/recipes/*.ts`, `global-css.ts` | **No.** Only through the adapter. |
| Adapter | `packages/react/src/recipes/headless.ts` | **Yes.** The only styling file that does. |
| Components | `packages/react/src/<name>/*.tsx` | Yes, for behavior. Their public props must not (rule 5). |

## Rules

1. **Recipes never name the library's DOM contract.** No `[data-…]` selectors, no library CSS variables (`--anchor-width`, `--toast-index`…), and no preset-base condition that also matches a `data-*` attribute (`_active` is `:active` *and* `[data-active]`, which Base UI puts on the current tab; `_selected`, `_open`, `_checked`, `_invalid`… likewise). Write `state.*` and `vars.*` from `headless.ts`:

   ```ts
   [`&${state.checked}`]: { bg: 'control-checked' },
   [`${state.popupOpen} > &`]: { transform: 'rotate(180deg)' },
   [`&${state.entering}, &${state.exiting}`]: { opacity: '0' },
   maxHeight: `min(360px, ${vars.availableHeight})`,
   ```

   Allowed as they are: HTML pseudo-classes (`:disabled`, `:focus-within`, `:checked` on a native input), ARIA attributes on the element being styled (`[aria-invalid=true]`, `[aria-current=page]`, `[aria-pressed]`, `[aria-busy=true]`), Koi's own attributes and variables (`data-theme`, `data-font`, `--koi-*`, Panda token variables like `--blurs-panel`), and the preset conditions `_hover`, `_focusVisible`, `_disabled`, `_placeholder`, `_empty`, used on native elements for their native half.

2. **Name a state after what it means, not after the attribute.** Base UI marks the current tab `data-active`; the adapter calls it `state.selected`. Reuse an existing name when the meaning is the same; add a new one, with a doc comment, when it isn't.

3. **Write down what the recipes rely on beyond attributes.** Mount timing (`entering` / `exiting` and transitions), states that never overlap (invalid never on a disabled control), the tab indicator staying hidden until measured. These go in the list at the top of `headless.ts`, so a new adapter knows what it has to provide.

4. **A new library is a change to `headless.ts`, not to the recipes.** Widen a selector (`checked: ':is([data-checked], [data-kb-checked])'`), chain a variable (`'var(--anchor-width, var(--kb-popper-anchor-width))'`). If the other library can't produce a state at all (Kobalte has no "entering" marker), that component's adapter computes it and sets a Koi-owned attribute (`data-koi-entering`), and `headless.ts` selects that.

5. **Public props are Koi's, not the library's.** A prop type, callback argument or ref target in an exported `…Props` must not be a library type (`BaseSwitch.Root.ChangeEventDetails`, `BaseTabs.Root.Props`). Use Koi's own: change callbacks take `ChangeDetails` (`reason`, `event`, `cancel()`; `ChangeDetails<E>` in `@koi/core`, `ChangeDetails<Event>` on the web; Base UI's object already satisfies it, so it's passed straight through), and props are written out with plain types instead of `Pick<BaseSwitch.Root.Props, …>`. Prop *names* that match Base UI's (`inputRef`, `uncheckedValue`) are fine. Casting to a library type inside the component body is fine too; that isn't public.

`pnpm check` enforces rules 1 and 5 with `scripts/check-headless.mjs` (for rule 5: no name imported from `@base-ui/react` inside a top-level `type` or `interface` in that file). A line that really needs an exception gets `// koi-allow-headless` and a reason. Rules 2–4 are for review.
