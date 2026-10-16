import { alert } from './alert';
import { avatar } from './avatar';
import { badge } from './badge';
import { button } from './button';
import { card } from './card';
import { checkbox } from './checkbox';
import { dialog } from './dialog';
import { field } from './field';
import { input } from './input';
import { link } from './link';
import { pagination } from './pagination';
import { progress } from './progress';
import { radioGroup } from './radio-group';
import { select, selectPanel } from './select';
import { separator } from './divider';
import { skeleton } from './skeleton';
import { spinner } from './spinner';
import { switchRecipe } from './switch';
import { table } from './table';
import { tag } from './tag';
import { tabs } from './tabs';
import { textarea } from './textarea';
import { toast } from './toast';
import { tooltip } from './tooltip';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button, separator, skeleton, textarea };
export const slotRecipes = { alert, avatar, badge, card, checkbox, dialog, field, input, link, pagination, progress, radioGroup, select, selectPanel, spinner, switchRecipe, table, tabs, tag, toast, tooltip };
