import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cx } from '@koi/react/styled-system/css';
import { textarea } from '@koi/react/styled-system/recipes';
import { KoiFieldContext } from '../field/context';

export interface TextareaProps extends React.ComponentPropsWithRef<'textarea'> {
  /** Red edge and aria-invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
}

/**
 * A multi-line text field that matches Input. Resizes vertically, at least 80px tall.
 * Base UI has no textarea part, so this is Field.Control rendering a <textarea>.
 */
export function Textarea({ invalid, className, id, required, disabled, rows = 4, ...rest }: TextareaProps) {
  const f = React.useContext(KoiFieldContext);
  return (
    <BaseField.Control
      {...(rest as unknown as BaseField.Control.Props)}
      render={<textarea rows={rows} />}
      id={id ?? f?.id}
      required={required ?? f?.required}
      disabled={disabled}
      aria-invalid={invalid && !disabled ? true : rest['aria-invalid']}
      className={cx(textarea(), className)}
    />
  );
}
