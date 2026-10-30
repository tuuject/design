import { css } from '@koi/react/styled-system/css';
import { type FormEvent, type ReactNode, useCallback, useRef, useState, useSyncExternalStore } from 'react';
import {
  type FieldValues,
  FormProvider,
  get,
  type Path,
  type PathValue,
  type UseFormReturn,
  useFormState,
} from 'react-hook-form';
import { changedPaths, collectMarks } from './changes';
import { BAR_CLEARANCE, OutlineContext, STACKED_TOP, WIDE_TOP } from './context';
import { FormActionBar } from './FormActionBar';
import { FormOutline } from './outline';
import { SectionMenu, SectionNav } from './SectionNav';

export interface SectionedFormProps<T extends FieldValues> {
  /** The page's own `useForm()`. Pass `shouldFocusError: false`: the form moves to the first error itself. */
  form: UseFormReturn<T>;
  /**
   * Persists valid values. Resolve with what the server stored: it becomes the new baseline. Reject (with an Error
   * whose message is shown) to keep every edit as it is.
   */
  onSubmit: (values: T) => Promise<T>;
  /** FormSections. */
  children: ReactNode;
  /** Default「保存」. */
  submitLabel?: string;
  /** Offer「放弃更改」, which resets every field to the baseline after a confirmation. Default true. */
  discardable?: boolean;
}

/**
 * A long form in named sections: a sticky section list beside it (a dropdown above it in narrow containers), a
 * scrollspy, and a sticky action bar that counts unsaved fields and lists them. All form state stays in
 * react-hook-form: dirty means `dirtyFields` (against `defaultValues`, the last loaded or saved values), errors
 * mean `errors`; this component only maps them onto the sections and fields it knows about.
 */
export function SectionedForm<T extends FieldValues>({
  form,
  onSubmit,
  children,
  submitLabel = '保存',
  discardable = true,
}: SectionedFormProps<T>) {
  const [outline] = useState(() => new FormOutline());
  const attach = useCallback((el: HTMLDivElement) => outline.attach(el), [outline]);
  const startEdge = useCallback((el: HTMLDivElement) => outline.registerEdge('start', el), [outline]);
  const endEdge = useCallback((el: HTMLDivElement) => outline.registerEdge('end', el), [outline]);
  const { sections, fields } = useSyncExternalStore(outline.subscribe, outline.getStructure);
  const { dirtyFields, errors, isSubmitting, isSubmitSuccessful, disabled } = useFormState({ control: form.control });
  // react-hook-form puts register()ed values back into the DOM only when the component that called register
  // re-renders after reset() (after a save, on discard). Reading isDirty through the page's own formState
  // subscribes the page to it, so it re-renders even if it reads no form state itself; without this, a discard
  // left the inputs empty and unregistered.
  form.formState.isDirty;
  const { dirty, invalid } = collectMarks(fields, dirtyFields, errors);
  const dirtySections = new Set(dirty.map((m) => m.sectionId));
  const invalidSections = new Set(invalid.map((m) => m.sectionId));
  // The Save button only disables on the next render; this also stops an Enter or click that comes before it.
  const inFlight = useRef(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) {
      return;
    }
    inFlight.current = true;
    const run = form.handleSubmit(
      async (submitted) => {
        let saved: T;
        try {
          saved = await onSubmit(submitted);
        } catch (error) {
          // A form-level error: react-hook-form clears it on the next submit. Values and dirty state stay.
          form.setError('root.submit', {
            type: 'server',
            message: error instanceof Error ? error.message : String(error),
          });
          return;
        }
        // The server's copy is the new baseline. Anything edited while the request was in flight is put back on
        // top, and stays dirty against it.
        const current = form.getValues();
        const editedMeanwhile = changedPaths(submitted, current);
        form.reset(saved);
        for (const path of editedMeanwhile) {
          form.setValue(path as Path<T>, get(current, path) as PathValue<T, Path<T>>, { shouldDirty: true });
        }
      },
      (submitErrors) => {
        const first = outline.getStructure().fields.find((f) => f.mounted && get(submitErrors, f.name) != null);
        if (first) {
          outline.goToField(first.name);
        }
      },
    );
    run(event).finally(() => {
      inFlight.current = false;
    });
  };

  return (
    <OutlineContext.Provider value={outline}>
      <FormProvider {...form}>
        <div
          ref={attach}
          className={css({
            // Lays out by its own width, not the viewport's: a collapsed sidebar changes the room it has.
            containerType: 'inline-size',
            // Jump targets land below the sticky chrome and clear of the action bar. The scrollspy reads the
            // sections' value back, so its line moves with the layout.
            '& [data-form-section], & [data-form-field], & [data-form-field] *': {
              scrollMarginTop: STACKED_TOP,
              scrollMarginBottom: BAR_CLEARANCE,
            },
          })}
        >
          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr)',
              '@container (min-width: 720px)': {
                gridTemplateColumns: '200px minmax(0, 1fr)',
                columnGap: '8',
                '& [data-form-section], & [data-form-field], & [data-form-field] *': { scrollMarginTop: WIDE_TOP },
              },
            })}
          >
            <SectionNav
              outline={outline}
              sections={sections}
              dirtySections={dirtySections}
              invalidSections={invalidSections}
            />
            {/* The dropdown and the bar stick within this column, so it has to be as tall as the form. */}
            <div className={css({ minWidth: '0' })}>
              <SectionMenu
                outline={outline}
                sections={sections}
                dirtySections={dirtySections}
                invalidSections={invalidSections}
              />
              <form noValidate onSubmit={submit}>
                <div ref={startEdge} />
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>{children}</div>
                <div ref={endEdge} />
                <FormActionBar
                  outline={outline}
                  sections={sections}
                  dirty={dirty}
                  invalid={invalid}
                  submitting={isSubmitting}
                  saved={isSubmitSuccessful && dirty.length === 0}
                  submitError={errors.root?.submit?.message}
                  disabled={Boolean(disabled)}
                  submitLabel={submitLabel}
                  onDiscard={discardable ? () => form.reset() : null}
                />
              </form>
            </div>
          </div>
        </div>
      </FormProvider>
    </OutlineContext.Provider>
  );
}
