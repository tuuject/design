# Divider

A hairline separator: horizontal, horizontal with a centered label, or vertical inline.

**When to use:** to separate groups inside a card, menu or form, or between inline metadata ("日期 | 阅读时间"). Prefer spacing first, and add a divider only when space alone doesn't separate the groups. One continuous workspace (master and detail panes, a detail's title bar above its sections, a list's header row) separates its areas with hairlines instead of Cards: Cards frame independent things, and framing the parts of one workspace stacks frames. Where the line has to follow the layout (above the detail when stacked, beside it when wide, the full height of a pane), draw it as a 1px `divider` border on the pane rather than as a Divider element.

**The consumer supplies:** optionally `orientation` (`horizontal` or `vertical`) and `label`.

**Styling:** 1px `divider` (black or white at 10%, as in the blog's mobile menu). Horizontal dividers have `space-4` vertical margin. Labels are `small` in `text-muted`.
