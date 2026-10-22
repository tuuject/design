import arrowRight from '@iconify-icons/fa7-solid/arrow-right';
import arrowsRotate from '@iconify-icons/fa7-solid/arrows-rotate';
import bars from '@iconify-icons/fa7-solid/bars';
import download from '@iconify-icons/fa7-solid/download';
import eye from '@iconify-icons/fa7-solid/eye';
import gaugeHigh from '@iconify-icons/fa7-solid/gauge-high';
import moon from '@iconify-icons/fa7-solid/moon';
import pen from '@iconify-icons/fa7-solid/pen';
import plus from '@iconify-icons/fa7-solid/plus';
import receipt from '@iconify-icons/fa7-solid/receipt';
import rightFromBracket from '@iconify-icons/fa7-solid/right-from-bracket';
import sliders from '@iconify-icons/fa7-solid/sliders';
import sun from '@iconify-icons/fa7-solid/sun';
import tableColumns from '@iconify-icons/fa7-solid/table-columns';
import trashCan from '@iconify-icons/fa7-solid/trash-can';
import upload from '@iconify-icons/fa7-solid/upload';
import { type BuiltinIconProps, Icon, type IconData } from '@koi/react/icons';

// The template's business icons (nav destinations, shell controls, row actions), from Font Awesome Free Solid
// like Koi's own. Another Iconify set or a hand-written `{ body, width, height }` works the same way.
function icon(data: IconData) {
  return (props: BuiltinIconProps) => <Icon icon={data} {...props} />;
}

export const LayoutIcon = icon(gaugeHigh);
export const OrdersIcon = icon(receipt);
export const SlidersIcon = icon(sliders);
export const LogoutIcon = icon(rightFromBracket);
export const SunIcon = icon(sun);
export const MoonIcon = icon(moon);
export const MenuIcon = icon(bars);
// Free Solid has no sidebar icon; two columns reads closest.
export const PanelLeftIcon = icon(tableColumns);
export const TrashIcon = icon(trashCan);
export const EyeIcon = icon(eye);
export const ArrowRightIcon = icon(arrowRight);
export const PlusIcon = icon(plus);
export const EditIcon = icon(pen);
export const RefreshIcon = icon(arrowsRotate);
export const UploadIcon = icon(upload);
export const DownloadIcon = icon(download);
