import arrowUpRightFromSquare from '@iconify-icons/fa7-solid/arrow-up-right-from-square';
import check from '@iconify-icons/fa7-solid/check';
import chevronDown from '@iconify-icons/fa7-solid/chevron-down';
import chevronLeft from '@iconify-icons/fa7-solid/chevron-left';
import chevronRight from '@iconify-icons/fa7-solid/chevron-right';
import chevronUp from '@iconify-icons/fa7-solid/chevron-up';
import circleCheck from '@iconify-icons/fa7-solid/circle-check';
import circleInfo from '@iconify-icons/fa7-solid/circle-info';
import circleXmark from '@iconify-icons/fa7-solid/circle-xmark';
import magnifyingGlass from '@iconify-icons/fa7-solid/magnifying-glass';
import sort from '@iconify-icons/fa7-solid/sort';
import sortDown from '@iconify-icons/fa7-solid/sort-down';
import sortUp from '@iconify-icons/fa7-solid/sort-up';
import triangleExclamation from '@iconify-icons/fa7-solid/triangle-exclamation';
import xmark from '@iconify-icons/fa7-solid/xmark';
import type { IconData, IconOwnProps } from '@koi/core';
import { sizes } from '@koi/tokens/dimensions';
import type { ComponentPropsWithRef } from 'react';

export type { IconData, IconOwnProps } from '@koi/core';

export interface IconProps
  extends IconOwnProps,
    Omit<ComponentPropsWithRef<'svg'>, keyof IconOwnProps | 'children' | 'dangerouslySetInnerHTML'> {}

/**
 * Draws Iconify-format icon data (`@iconify-icons/<set>/<name>`, or a hand-written `{ body, width, height }`) as
 * an inline SVG in currentColor. Decorative: the control around it carries the accessible name.
 */
export function Icon({ icon, size = sizes.icon, ...rest }: IconProps) {
  const { body, width = 16, height = 16, left = 0, top = 0 } = icon;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`${left} ${top} ${width} ${height}`}
      aria-hidden="true"
      {...rest}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: icon bodies are static SVG markup from icon packages or our own source, never user input.
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}

export type BuiltinIconProps = Omit<IconProps, 'icon'>;

function builtin(icon: IconData) {
  return (props: BuiltinIconProps) => <Icon icon={icon} {...props} />;
}

// The icons Koi's components draw, all Font Awesome Free Solid (CC BY 4.0).
export const CloseIcon = builtin(xmark);
export const CheckIcon = builtin(check);
export const ExternalIcon = builtin(arrowUpRightFromSquare);
export const InfoIcon = builtin(circleInfo);
export const WarningIcon = builtin(triangleExclamation);
export const SuccessIcon = builtin(circleCheck);
export const ErrorIcon = builtin(circleXmark);
export const SearchIcon = builtin(magnifyingGlass);
export const ChevronDownIcon = builtin(chevronDown);
export const ChevronUpIcon = builtin(chevronUp);
export const ChevronLeftIcon = builtin(chevronLeft);
export const ChevronRightIcon = builtin(chevronRight);
export const SortIcon = builtin(sort);
export const SortUpIcon = builtin(sortUp);
export const SortDownIcon = builtin(sortDown);
