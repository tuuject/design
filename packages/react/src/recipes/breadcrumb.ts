import { defineSlotRecipe } from '@pandacss/dev/define';

// The trail in a topbar: muted ancestors that turn brand on hover, a bold current page, chevrons between them.
// Everything truncates, so a deep trail shortens its crumbs instead of pushing the topbar wider than the viewport.
// DOM: <nav aria-label> <ol> <li> [<span separator aria-hidden/>] <a|span label/> </li>… </ol> </nav>.
export const breadcrumb = defineSlotRecipe({
  className: 'koi-breadcrumb',
  slots: ['root', 'list', 'item', 'separator', 'label'],
  base: {
    // minWidth 0 + hidden overflow: the nav may shrink inside a flex row (the topbar) and ellipsizes instead.
    root: { display: 'flex', alignItems: 'center', minWidth: '0', overflow: 'hidden' },
    list: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      gap: '1',
      m: '0',
      p: '0',
      minWidth: '0',
      listStyleType: 'none',
    },
    // The item carries the muted color, so a plain span and a Link variant="plain" read the same. Ancestors keep
    // their width (a crumb is a section name, not a sentence) and the current page is the one that gives way: with
    // ellipsis on every label, any shrink at all would eat a character off "首页", so only the current crumb shrinks.
    item: { display: 'flex', alignItems: 'center', gap: '1', minWidth: '0', flexShrink: '0', color: 'text-muted' },
    separator: {
      display: 'inline-flex',
      flexShrink: '0',
      color: 'text-muted',
      '& > svg': { width: 'icon-sm', height: 'icon-sm' },
    },
    label: { minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  },
  variants: {
    // Only the current crumb is bold and in `text`, and only it shrinks: a long page title ends in an ellipsis
    // instead of widening the topbar or squeezing the trail in front of it.
    current: {
      true: { item: { flexShrink: '1' }, label: { color: 'text', fontWeight: 'bold' } },
    },
  },
});
