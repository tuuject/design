import arrowUpRightFromSquare from '@iconify-icons/fa7-solid/arrow-up-right-from-square';
import arrowRight from '@iconify-icons/fa7-solid/arrow-right';
import check from '@iconify-icons/fa7-solid/check';
import chevronDown from '@iconify-icons/fa7-solid/chevron-down';
import chevronLeft from '@iconify-icons/fa7-solid/chevron-left';
import chevronRight from '@iconify-icons/fa7-solid/chevron-right';
import chevronUp from '@iconify-icons/fa7-solid/chevron-up';
import circleCheck from '@iconify-icons/fa7-solid/circle-check';
import circleInfo from '@iconify-icons/fa7-solid/circle-info';
import circleXmark from '@iconify-icons/fa7-solid/circle-xmark';
import gripVertical from '@iconify-icons/fa7-solid/grip-vertical';
import magnifyingGlass from '@iconify-icons/fa7-solid/magnifying-glass';
import plus from '@iconify-icons/fa7-solid/plus';
import sort from '@iconify-icons/fa7-solid/sort';
import sortDown from '@iconify-icons/fa7-solid/sort-down';
import sortUp from '@iconify-icons/fa7-solid/sort-up';
import trash from '@iconify-icons/fa7-solid/trash';
import triangleExclamation from '@iconify-icons/fa7-solid/triangle-exclamation';
import upload from '@iconify-icons/fa7-solid/upload';
import xmark from '@iconify-icons/fa7-solid/xmark';
import type { IconData, IconOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import type { ComponentPropsWithRef } from 'react';

export type { IconData, IconOwnProps } from '@tuuject/koi-core';

export interface IconProps
  extends IconOwnProps,
    Omit<ComponentPropsWithRef<'svg'>, keyof IconOwnProps | 'children' | 'dangerouslySetInnerHTML'> {}

/**
 * Draws Iconify-format icon data (`@iconify-icons/<set>/<name>`, or a hand-written `{ body, width, height }`) as
 * an inline SVG in currentColor. Decorative: the control around it carries the accessible name.
 * `mirrored` flips the drawing in RTL (see `.koi-mirror` in global-css.ts).
 */
export function Icon({ icon, size = sizes.icon, mirrored, className, ...rest }: IconProps) {
  const { body, width = 16, height = 16, left = 0, top = 0 } = icon;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${left} ${top} ${width} ${height}`}
      aria-hidden="true"
      {...rest}
      className={mirrored ? cx('koi-mirror', className) : className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: icon bodies are static SVG markup from icon packages or our own source, never user input.
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export type BuiltinIconProps = Omit<IconProps, 'icon'>;

function builtin(icon: IconData, mirrored = false) {
  const Builtin = (props: BuiltinIconProps) => <Icon icon={icon} mirrored={mirrored} {...props} />;
  return Builtin;
}

// The icons Koi's components draw, all Font Awesome Free Solid (CC BY 4.0). The second argument marks a drawing
// that points along the reading direction: it flips in RTL, everything else never does.
export const CloseIcon = builtin(xmark);
export const CheckIcon = builtin(check);
export const ExternalIcon = builtin(arrowUpRightFromSquare);
export const ArrowRightIcon = builtin(arrowRight, true);
export const GripVerticalIcon = builtin(gripVertical);
export const PlusIcon = builtin(plus);
export const TrashIcon = builtin(trash);
export const InfoIcon = builtin(circleInfo);
export const WarningIcon = builtin(triangleExclamation);
export const SuccessIcon = builtin(circleCheck);
export const ErrorIcon = builtin(circleXmark);
export const SearchIcon = builtin(magnifyingGlass);
export const UploadIcon = builtin(upload);
export const ChevronDownIcon = builtin(chevronDown);
export const ChevronUpIcon = builtin(chevronUp);
export const ChevronLeftIcon = builtin(chevronLeft, true);
export const ChevronRightIcon = builtin(chevronRight, true);
export const SortIcon = builtin(sort);
export const SortUpIcon = builtin(sortUp);
export const SortDownIcon = builtin(sortDown);
