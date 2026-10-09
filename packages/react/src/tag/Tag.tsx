import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { tag } from '@koi/react/styled-system/recipes';
import { CloseIcon } from '../icons';

export interface TagProps extends Omit<React.ComponentPropsWithRef<'span'>, 'children'> {
  children: React.ReactNode;
  /** A 14px icon before the label. */
  icon?: React.ReactNode;
  /** The `action-subtle` fill of a chosen filter chip. On its own it's only the look. */
  selected?: boolean;
  /**
   * Makes the tag a toggle (a `<button aria-pressed>` filling the pill) for filter chips.
   * Called with the next state on click, Enter or Space; pass `selected` back.
   */
  onSelectedChange?: (selected: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Shows a remove (×) button, named "移除 <label>". */
  onRemove?: () => void;
}

/** An outlined pill chip for keywords, filters and removable selections. For pure status, use Badge. */
export function Tag({ children, icon, selected = false, onSelectedChange, onRemove, className, ...rest }: TagProps) {
  const s = tag({ selected });
  const id = React.useId();
  const labelId = `${id}-label`;
  const removeId = `${id}-remove`;

  const content = (
    <>
      {icon ? <span className={s.icon} aria-hidden="true">{icon}</span> : null}
      <span className={s.label} id={onRemove ? labelId : undefined}>{children}</span>
    </>
  );

  return (
    <span {...rest} className={cx(s.root, className)}>
      {onSelectedChange ? (
        <button type="button" className={s.toggle} aria-pressed={selected} onClick={(e) => onSelectedChange(!selected, e)}>
          {content}
        </button>
      ) : (
        content
      )}
      {onRemove ? (
        // Named "移除 <label>" from the label's own text, whatever the children are (legacy only managed strings).
        <button type="button" id={removeId} className={s.remove} aria-label="移除" aria-labelledby={`${removeId} ${labelId}`} onClick={onRemove}>
          <CloseIcon />
        </button>
      ) : null}
    </span>
  );
}
