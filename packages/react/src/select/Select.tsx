import { Field as BaseField } from '@base-ui/react/field';
import type { SelectOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { select } from '@koi/react/styled-system/recipes';
import * as React from 'react';
import { KoiFieldContext } from '../field/context';
import { ChevronDownIcon } from '../icons';

export type { SelectOption } from '@koi/core';

export interface SelectProps
  extends SelectOwnProps,
    Omit<React.ComponentPropsWithRef<'select'>, keyof SelectOwnProps> {}

/**
 * A native dropdown styled like Input. It opens the platform picker (the system sheet on phones) and is fully
 * keyboard accessible. For grouped, searchable or custom-drawn options, use SelectPanel.
 * Base UI has no native select part, so this is Field.Control rendering a <select>.
 */
export function Select({
  options,
  placeholder,
  size = 'md',
  invalid,
  className,
  id,
  required,
  disabled,
  children,
  ...rest
}: SelectProps) {
  const f = React.useContext(KoiFieldContext);
  const s = select({ size });
  // Uncontrolled with a placeholder: start on it, as legacy did.
  const defaultValue =
    placeholder && rest.value === undefined && rest.defaultValue === undefined ? '' : rest.defaultValue;
  const content = (
    <>
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {children ??
        options?.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
    </>
  );
  return (
    <span className={cx(s.root, className)}>
      <BaseField.Control
        {...(rest as unknown as BaseField.Control.Props)}
        defaultValue={defaultValue}
        render={(props) => <select {...(props as React.ComponentProps<'select'>)}>{content}</select>}
        id={id ?? f?.id}
        required={required ?? f?.required}
        disabled={disabled}
        aria-invalid={invalid && !disabled ? true : rest['aria-invalid']}
        className={s.el}
      />
      <span className={s.chevron} aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </span>
  );
}
