import { button } from './button';
import { dialog } from './dialog';
import { skeleton } from './skeleton';
import { spinner } from './spinner';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button, skeleton };
export const slotRecipes = { dialog, spinner };
