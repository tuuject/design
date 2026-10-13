import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { cx } from '@koi/react/styled-system/css';
import { checkbox } from '@koi/react/styled-system/recipes';
import { CheckIcon } from '../icons';
import { KoiFieldContext } from '../field/context';
import type { CheckboxOwnProps } from '@koi/core';

export interface CheckboxProps
  extends CheckboxOwnProps<Event>,
    Omit<React.ComponentPropsWithRef<'input'>, keyof CheckboxOwnProps | 'type' | 'value' | 'onChange' | 'children'> {
  /** Submitted with the form while ticked (the native "on" when omitted). */
  value?: string;
  /**
   * The legacy native handler: React's change event from the hidden input, caught as it bubbles to the row,
   * so `event.target.checked` is the new state (`currentTarget` is the row). Runs after `onCheckedChange`.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * A 16px checkbox with a label and an optional description; the whole row is the click target.
 * Renders Base UI's `<span role="checkbox">` plus a hidden `<input type="checkbox">` that carries
 * `id`, `name`, `value`, `required` and `form`; `ref` reaches that input. Inside a Field it picks up
 * the error (red edge, aria-describedby), `required`, `disabled` and `id`.
 */
export function Checkbox({
  label,
  description,
  className,
  style,
  id,
  required,
  ref,
  onChange,
  onCheckedChange,
  'aria-labelledby': labelledBy,
  'aria-describedby': describedBy,
  ...rest
}: CheckboxProps) {
  const f = React.useContext(KoiFieldContext);
  const s = checkbox();
  const uid = React.useId();
  const hasLabel = label != null;
  const labelId = hasLabel ? `${uid}-label` : undefined;
  const descId = hasLabel && description ? `${uid}-desc` : undefined;
  // Without a label there's no row to click; a <span> also keeps Base UI from naming the box after an
  // empty <label>, which would override an aria-label.
  const Root = hasLabel ? 'label' : 'span';

  return (
    <Root className={cx(s.root, className)} style={style} onChange={onChange as React.ChangeEventHandler<HTMLElement>}>
      <BaseCheckbox.Root
        {...(rest as BaseCheckbox.Root.Props)}
        inputRef={ref}
        id={id ?? f?.id}
        required={required ?? f?.required}
        // Named by its own label, not the whole row, so the description is read as a description.
        aria-labelledby={labelledBy ?? labelId}
        aria-describedby={cx(describedBy, descId) || undefined}
        onCheckedChange={onCheckedChange}
        className={s.control}
      >
        <BaseCheckbox.Indicator keepMounted className={s.indicator}>
          <CheckIcon />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {hasLabel ? (
        <span className={s.text}>
          <span id={labelId} className={s.label}>{label}</span>
          {descId ? <span id={descId} className={s.description}>{description}</span> : null}
        </span>
      ) : null}
    </Root>
  );
}
