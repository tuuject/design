import { Field as BaseField } from '@base-ui/react/field';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import type { RadioGroupOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { radioGroup } from '@koi/react/styled-system/recipes';
import * as React from 'react';
import { KoiFieldContext } from '../field/context';

export type { RadioOption } from '@koi/core';

export interface RadioGroupProps
  extends RadioGroupOwnProps<Event>,
    Omit<React.ComponentPropsWithRef<'div'>, keyof RadioGroupOwnProps | 'defaultValue' | 'children' | 'aria-label'> {
  /** Submitted with the form as `name=value`. */
  name?: string;
  /** A choice must be made before the form submits. Taken from the Field when omitted. */
  required?: boolean;
}

/**
 * 2–5 mutually exclusive options, all visible. Arrow keys move the choice; Tab enters and leaves the group.
 * Each radio is Base UI's `<span role="radio">` plus a hidden `<input type="radio">`; the whole row is the click
 * target. Inside a Field it's named by the Field's label and picks up its error, help, `required` and `id`.
 */
export function RadioGroup({
  options,
  value,
  defaultValue,
  onChange,
  label,
  name,
  orientation = 'vertical',
  disabled,
  required,
  id,
  className,
  ...rest
}: RadioGroupProps) {
  const f = React.useContext(KoiFieldContext);
  const s = radioGroup({ orientation });
  const uid = React.useId();
  // Inside a Field each row needs its own Field.Item: otherwise every radio takes the Field's label as its name
  // and the Field's control id as its input id.
  const Row = f ? BaseField.Item : 'label';

  return (
    <BaseRadioGroup
      {...rest}
      id={id ?? f?.id}
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange as BaseRadioGroup.Props['onValueChange']}
      name={name}
      disabled={disabled}
      required={required ?? f?.required}
      className={cx(s.root, className)}
    >
      {options.map((o, i) => {
        const labelId = `${uid}-${i}-label`;
        const descId = o.description ? `${uid}-${i}-desc` : undefined;
        return (
          // biome-ignore lint/a11y/noLabelWithoutControl: the radio input renders inside this label
          <Row key={o.value} className={s.item} {...(f ? { render: <label /> } : null)}>
            <Radio.Root
              value={o.value}
              disabled={o.disabled}
              // Named by its own label, not the whole row, so the description is read as a description.
              aria-labelledby={labelId}
              aria-describedby={descId}
              className={s.control}
            >
              <Radio.Indicator keepMounted className={s.indicator} />
            </Radio.Root>
            <span className={s.text}>
              <span id={labelId} className={s.label}>
                {o.label}
              </span>
              {descId ? (
                <span id={descId} className={s.description}>
                  {o.description}
                </span>
              ) : null}
            </span>
          </Row>
        );
      })}
    </BaseRadioGroup>
  );
}
