import { alert } from './alert';
import { badge } from './badge';
import { button } from './button';
import { card } from './card';
import { dialog } from './dialog';
import { link } from './link';
import { separator } from './divider';
import { skeleton } from './skeleton';
import { spinner } from './spinner';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button, separator, skeleton };
export const slotRecipes = { alert, badge, card, dialog, link, spinner };
