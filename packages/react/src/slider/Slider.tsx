import { Slider as BaseSlider } from '@base-ui/react/slider';
import type { SliderOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { slider } from '@tuuject/koi-react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';

export type { SliderCommitDetails } from '@tuuject/koi-core';

export interface SliderProps
  extends SliderOwnProps<Event>,
    Omit<ComponentPropsWithRef<'div'>, keyof SliderOwnProps | 'children' | 'defaultValue' | 'aria-label'> {
  /** Names the thumb when there's no visible `label`. */
  'aria-label'?: string;
}

/**
 * A single-thumb range control: a 6px pill track with a sky fill and a 20px round thumb.
 * Base UI renders the thumb with a visually hidden `<input type="range">`, so arrows, Home/End and typing work.
 * Inside a Field it picks up the label, help, error and disabled state.
 */
export function Slider({
  value,
  defaultValue,
  min,
  max,
  step,
  onValueChange,
  onValueCommitted,
  label,
  showValue = false,
  formatValue,
  disabled,
  className,
  'aria-label': ariaLabel,
  ...rest
}: SliderProps) {
  const s = slider();
  const head = label != null || showValue;

  return (
    <BaseSlider.Root
      {...(rest as BaseSlider.Root.Props<number>)}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      // Keep the whole thumb inside the track at both ends instead of half of it hanging over the edge.
      thumbAlignment="edge"
      disabled={disabled}
      onValueChange={onValueChange as BaseSlider.Root.Props<number>['onValueChange']}
      onValueCommitted={onValueCommitted as BaseSlider.Root.Props<number>['onValueCommitted']}
      className={cx(s.root, className)}
    >
      {head ? (
        <div className={s.head}>
          {label != null ? <BaseSlider.Label className={s.label}>{label}</BaseSlider.Label> : null}
          {showValue ? (
            <BaseSlider.Value render={<span />} className={s.value}>
              {(formattedValues, values) => (formatValue ? formatValue(values[0]) : formattedValues[0])}
            </BaseSlider.Value>
          ) : null}
        </div>
      ) : null}
      <BaseSlider.Control className={s.control}>
        <BaseSlider.Track className={s.track}>
          <BaseSlider.Indicator className={s.indicator} />
        </BaseSlider.Track>
        <BaseSlider.Thumb
          className={s.thumb}
          aria-label={ariaLabel}
          getAriaValueText={(formatted, raw) => (formatValue ? formatValue(raw) : formatted)}
        />
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
