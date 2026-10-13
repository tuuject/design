import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import { cx } from '@koi/react/styled-system/css';
import { input } from '@koi/react/styled-system/recipes';
import { KoiFieldContext } from '../field/context';
import type { InputOwnProps } from '@koi/core';

export interface InputProps extends InputOwnProps, Omit<React.ComponentPropsWithRef<'input'>, keyof InputOwnProps> {}

/**
 * A single-line text field. Inside a Field it picks up the label, help, error and required state;
 * on its own, give it an aria-label.
 */
export function Input({ size = 'md', invalid, iconStart, iconEnd, className, id, required, disabled, ...rest }: InputProps) {
  const f = React.useContext(KoiFieldContext);
  const s = input({ size });
  return (
    <span className={cx(s.root, className)}>
      {iconStart ? <span className={s.icon}>{iconStart}</span> : null}
      <BaseInput
        {...(rest as BaseInput.Props)}
        id={id ?? f?.id}
        required={required ?? f?.required}
        disabled={disabled}
        // Inside an invalid Field, Base UI adds aria-invalid itself. A disabled control is never marked invalid.
        aria-invalid={invalid && !disabled ? true : rest['aria-invalid']}
        className={s.el}
      />
      {iconEnd ? <span className={s.icon}>{iconEnd}</span> : null}
    </span>
  );
}
