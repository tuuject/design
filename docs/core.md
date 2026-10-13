# Core: what every platform shares

`@koi/core` (`packages/core`) is the platform-neutral part of each component, so the web package and a future native one implement the same Koi instead of two that drift apart. Tokens are shared the same way through `@koi/tokens`; core covers what tokens can't.

| In `@koi/core` | Stays in the platform package |
| --- | --- |
| `<Name>OwnProps`: what the component is and does (`color`, `variant`, `size`, `label`, `open`, `onCheckedChange`…) | DOM or native attributes, `className` / `style`, `ref` targets |
| Variant lists (`BUTTON_COLORS`) and their types (`ButtonColor`) | Event handlers of the platform (`onClick`, `onPress`), text input `value` / `onChange` |
| `ChangeDetails<E>`, with the platform's event as `E` | Form wiring (`name`, `value`, `required`, `form`, `inputRef`) |
| `strings`: every piece of copy a component writes itself | Rendering, styling, the headless library (`docs/headless.md`) |
| Pure logic (`pageList`, `initials`) and behavior constants (`TOAST_LIMIT`) | Anything that needs React state, context or effects |

## Rules

1. **Core is plain TypeScript.** It imports only types from `react` (`ReactNode`, `ReactElement`) and its own files. No DOM type (`Event`, `HTMLElement`, `MouseEvent`), no React Native type (`ViewProps`, `GestureResponderEvent`), no styling, no headless library.
2. **A callback that hands over a platform event takes it as a type parameter.** `CheckboxOwnProps<E>` → `onCheckedChange(checked, details: ChangeDetails<E>)`; the web package fills in `Event`, native would fill in its press event. Tag's `onSelectedChange(selected, event: E)` works the same way.
3. **Every platform's `<Name>Props` is built on `<Name>OwnProps`.** On the web:

   ```ts
   export interface AlertProps extends AlertOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof AlertOwnProps> {}
   export interface SwitchProps extends SwitchOwnProps<Event>, Omit<React.ComponentPropsWithRef<'button'>, keyof SwitchOwnProps | …> {
     name?: string; // form wiring is the web's own
   }
   ```

   A prop goes into core when a native version would need it to mean the same thing. If you're unsure, it goes to core; moving a prop out later is a breaking change on one platform, moving one in isn't.
4. **Copy comes from `strings`.** No Chinese string literal in a component; add the string to `packages/core/src/strings.ts` (Simplified Chinese, no emoji) and use `strings.close`.
5. **Platform packages re-export the core types they used to own** (`ButtonColor`, `RadioOption`, `SelectOption`…) from the component file, so `@koi/react/button` still exports them.

`pnpm check` enforces rules 1–3 with `scripts/check-core.mjs` (and `pnpm typecheck` compiles core without the DOM lib). A line that really needs an exception gets `// koi-allow-core` and a reason.
