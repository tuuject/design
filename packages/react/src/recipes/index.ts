import { button } from './button';
import { dialog } from './dialog';
import { spinner } from './spinner';

// Register every recipe here; panda.config.ts spreads these into theme.extend.
export const recipes = { button };
export const slotRecipes = { dialog, spinner };
