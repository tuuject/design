import { Field, type FieldProps } from '@koi/react/field';
import { css, cx } from '@koi/react/styled-system/css';
import { useCallback } from 'react';
import { get, useFormState } from 'react-hook-form';
import { useOutline, useSectionId } from './context';

export interface FormFieldProps extends Omit<FieldProps, 'label' | 'error'> {
  /** The value's react-hook-form path, as given to `register` or `Controller`. */
  name: string;
  /** Labels the control, and names the field in the change summary. */
  label: string;
  /** The control labels itself (Checkbox): don't repeat the label above it. */
  inlineLabel?: boolean;
}

/**
 * A Field that the SectionedForm knows about: it is counted when its value changes, listed in the change summary,
 * and can be scrolled to and highlighted. The error comes from react-hook-form by `name`.
 */
export function FormField({ name, label, inlineLabel, className, ...rest }: FormFieldProps) {
  const outline = useOutline();
  const sectionId = useSectionId();
  // Scoped to this field, so typing elsewhere doesn't re-render it.
  const { errors } = useFormState({ name });
  const error: unknown = get(errors, name)?.message;
  const register = useCallback(
    (el: HTMLDivElement) => outline.registerField(name, label, sectionId, el),
    [outline, name, label, sectionId],
  );

  return (
    <div
      ref={register}
      data-form-field={name}
      // Takes focus itself only when jumped to by touch (see FormOutline.goToField); the control inside keeps Tab.
      tabIndex={-1}
      className={cx(
        css({
          // The highlight bleeds 12px around the field into the 16px gap, without moving anything.
          margin: '-3',
          padding: '3',
          borderRadius: 'panel',
          outline: 'none',
          transitionProperty: 'background-color',
          transitionDuration: 'fast',
          '&[data-flash]': { bg: 'highlight' },
        }),
        className,
      )}
    >
      <Field {...rest} label={inlineLabel ? undefined : label} error={typeof error === 'string' ? error : undefined} />
    </div>
  );
}
