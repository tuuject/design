import * as React from 'react';
import { Field as BaseField } from '@base-ui/react/field';
import { cx } from '@koi/react/styled-system/css';
import { field } from '@koi/react/styled-system/recipes';
import { ErrorIcon } from '../icons';
import { KoiFieldContext } from './context';
import { strings, type FieldOwnProps } from '@koi/core';

export interface FieldProps extends FieldOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof FieldOwnProps | 'id'> {
  /** The control's id (the label points at it). Generated when omitted. */
  id?: string;
}

/**
 * A form row: label, one control, error and help text, wired together by Base UI's Field.
 * Stack Fields with space-4 between them.
 */
export function Field({ label, help, error, required, optional, id, className, children, ...rest }: FieldProps) {
  const s = field();
  const hasError = error != null && error !== false && error !== '';
  const ctx = React.useMemo(() => ({ id, required }), [id, required]);
  return (
    <KoiFieldContext.Provider value={ctx}>
      <BaseField.Root {...rest} invalid={hasError} className={cx(s.root, className)}>
        {label != null ? (
          <BaseField.Label className={s.label}>
            {label}
            {required ? <span className={s.required} aria-hidden="true"> *</span> : null}
            {optional ? <span className={s.optional}>{strings.optional}</span> : null}
          </BaseField.Label>
        ) : null}
        {children}
        {hasError ? (
          <BaseField.Error match className={s.error} render={<p />}>
            <ErrorIcon size={12} />
            <span>{error}</span>
          </BaseField.Error>
        ) : null}
        {help ? <BaseField.Description className={s.help}>{help}</BaseField.Description> : null}
      </BaseField.Root>
    </KoiFieldContext.Provider>
  );
}
