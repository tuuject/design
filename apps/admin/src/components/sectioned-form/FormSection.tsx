import { css, cx } from '@koi/react/styled-system/css';
import { card } from '@koi/react/styled-system/recipes';
import { type ReactNode, useCallback, useId } from 'react';
import { focusRing } from '../app-shell/shared';
import { SectionContext, useOutline } from './context';

export interface FormSectionProps {
  /** Stable key the navigation and the change summary use for this section. Unique within the form. */
  id: string;
  /** The heading, also the section's entry in the navigation. */
  title: string;
  description?: ReactNode;
  /** FormFields, stacked 16px apart. */
  children: ReactNode;
}

/**
 * One titled part of a SectionedForm. Drawn with the Card recipe rather than <Card>, which titles itself with an
 * <h3>: under the page's <h1> a section heading is an <h2>.
 */
export function FormSection({ id, title, description, children }: FormSectionProps) {
  const outline = useOutline();
  const headingId = useId();
  const register = useCallback((el: HTMLElement) => outline.registerSection(id, title, el), [outline, id, title]);
  const s = card();

  return (
    <SectionContext.Provider value={id}>
      <section ref={register} data-form-section aria-labelledby={headingId} className={s.root}>
        <div className={s.head}>
          <h2
            id={headingId}
            // Focus target after a jump from the navigation, so Tab carries on inside the section.
            tabIndex={-1}
            data-section-heading
            className={cx(s.title, css({ borderRadius: 'sm', outline: 'none', _focusVisible: focusRing }))}
          >
            {title}
          </h2>
          {description ? <p className={s.description}>{description}</p> : null}
        </div>
        <div className={cx(s.body, css({ display: 'flex', flexDirection: 'column', gap: '4' }))}>{children}</div>
      </section>
    </SectionContext.Provider>
  );
}
