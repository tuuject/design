import { alert } from './alert.js';
import { avatar } from './avatar.js';
import { badge } from './badge.js';
import { button } from './button.js';
import { card } from './card.js';
import { chatBubble } from './chat-bubble.js';
import { checkbox } from './checkbox.js';
import { dialog } from './dialog.js';
import { dropZone } from './drop-zone.js';
import { separator } from './divider.js';
import { field } from './field.js';
import { input } from './input.js';
import { link } from './link.js';
import { pagination } from './pagination.js';
import { progress } from './progress.js';
import { prose } from './prose.js';
import { radioGroup } from './radio-group.js';
import { select, selectPanel } from './select.js';
import { slider } from './slider.js';
import { skeleton } from './skeleton.js';
import { spinner } from './spinner.js';
import { switchRecipe } from './switch.js';
import { table } from './table.js';
import { tabs } from './tabs.js';
import { tag } from './tag.js';
import { textarea } from './textarea.js';
import { toast } from './toast.js';
import { tooltip } from './tooltip.js';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button, chatBubble, prose, separator, skeleton, textarea };
export const slotRecipes = {
  alert,
  avatar,
  badge,
  card,
  checkbox,
  dialog,
  dropZone,
  field,
  input,
  link,
  pagination,
  progress,
  radioGroup,
  select,
  selectPanel,
  slider,
  spinner,
  switchRecipe,
  table,
  tabs,
  tag,
  toast,
  tooltip,
};
