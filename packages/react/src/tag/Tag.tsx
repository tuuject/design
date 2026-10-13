import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { tag } from '@koi/react/styled-system/recipes';
import { CloseIcon } from '../icons';
import { strings, type TagOwnProps } from '@koi/core';

export interface TagProps
  extends TagOwnProps<React.MouseEvent<HTMLButtonElement>>,
    Omit<React.ComponentPropsWithRef<'span'>, keyof TagOwnProps | 'children'> {}

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
        <button type="button" id={removeId} className={s.remove} aria-label={strings.remove} aria-labelledby={`${removeId} ${labelId}`} onClick={onRemove}>
          <CloseIcon />
        </button>
      ) : null}
    </span>
  );
}
