import { alert } from './alert';
import { badge } from './badge';
import { button } from './button';
import { card } from './card';
import { checkbox } from './checkbox';
import { dialog } from './dialog';
import { field } from './field';
import { input } from './input';
import { link } from './link';
import { radioGroup } from './radio-group';
import { separator } from './divider';
import { skeleton } from './skeleton';
import { spinner } from './spinner';
import { switchRecipe } from './switch';
import { textarea } from './textarea';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button, separator, skeleton, textarea };
export const slotRecipes = { alert, badge, card, checkbox, dialog, field, input, link, radioGroup, spinner, switchRecipe };
