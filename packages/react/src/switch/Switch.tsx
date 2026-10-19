import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { SwitchOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { switchRecipe } from '@koi/react/styled-system/recipes';
import * as React from 'react';
import { KoiFieldContext } from '../field/context';

export interface SwitchProps
  extends SwitchOwnProps<Event>,
    Omit<
      React.ComponentPropsWithRef<'button'>,
      keyof SwitchOwnProps | 'required' | 'name' | 'value' | 'form' | 'type' | 'children' | 'onChange' | 'defaultValue'
    > {
  required?: boolean;
  /** The hidden input's name, for form submission. */
  name?: string;
  /** Submitted when on. */
  value?: string;
  /** Submitted when off (by default nothing is). */
  uncheckedValue?: string;
  /** The id of the form the hidden input belongs to. */
  form?: string;
  /** Reaches the hidden `<input>`. */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * A 36 × 20px pill toggle for a setting that applies at once; the whole row is the click target.
 * Renders a `<button role="switch">` (which gets `id`, `ref` and the other button attributes) plus a hidden
 * `<input>` outside the row that carries `name`, `value`, `required` and `form` (`inputRef` reaches it).
 * Inside a Field it picks up the error and help (aria-describedby), `required`, `disabled` and `id`.
 */
export function Switch({
  label,
  className,
  style,
  id,
  required,
  onCheckedChange,
  'aria-labelledby': labelledBy,
  ...rest
}: SwitchProps) {
  const f = React.useContext(KoiFieldContext);
  const s = switchRecipe();
  const uid = React.useId();
  const hasLabel = label != null;
  const labelId = hasLabel ? `${uid}-label` : undefined;

  return (
    <BaseSwitch.Root
      {...(rest as BaseSwitch.Root.Props)}
      nativeButton
      id={id ?? f?.id}
      required={required ?? f?.required}
      // Named by its own label, not a Field label around it.
      aria-labelledby={labelledBy ?? labelId}
      onCheckedChange={onCheckedChange}
      className={hasLabel ? s.control : cx(s.control, className)}
      style={hasLabel ? undefined : style}
      // The row <label> goes inside the render so Base UI's hidden input lands beside it, not in it
      // (a label may hold only one labelable element). Without a label there's no row.
      render={(props) =>
        hasLabel ? (
          <label className={cx(s.root, className)} style={style}>
            <button {...props} type="button" />
            <span id={labelId} className={s.label}>
              {label}
            </span>
          </label>
        ) : (
          <button {...props} type="button" />
        )
      }
    >
      <BaseSwitch.Thumb className={s.thumb} />
    </BaseSwitch.Root>
  );
}
