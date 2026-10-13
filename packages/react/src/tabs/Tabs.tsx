import * as React from 'react';
import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { cx } from '@koi/react/styled-system/css';
import { tabs } from '@koi/react/styled-system/recipes';
import type { TabsOwnProps } from '@koi/core';

export type { TabItem } from '@koi/core';


export interface TabsProps
  extends TabsOwnProps<Event>,
    Omit<React.ComponentPropsWithRef<'div'>, keyof TabsOwnProps | 'defaultValue' | 'children' | 'aria-label'> {}

/**
 * A segmented pill track for 2–6 peer views. The active tab is a white pill (Base UI's Tabs.Indicator) that
 * springs to the newly chosen tab. ←/→ move and choose (skipping disabled tabs, wrapping), Home/End jump.
 * Only the active item's `content` is mounted, in a focusable tabpanel.
 */
export function Tabs({ items, value, defaultValue, onChange, label, fullWidth = false, className, ...rest }: TabsProps) {
  const s = tabs({ fullWidth });
  // Legacy picked the first item; pick the first enabled one so Base UI never has to fall back by itself.
  const initial = defaultValue ?? (items.find((i) => !i.disabled) ?? items[0])?.value;

  return (
    <BaseTabs.Root
      {...rest}
      value={value}
      defaultValue={value === undefined ? initial : undefined}
      onValueChange={(v, details) => {
        // Only user choices; Base UI's own fallbacks ('initial', 'disabled', 'missing') weren't events in legacy.
        if (details.reason === 'none') onChange?.(v as string, details);
      }}
      className={cx(s.root, className)}
    >
      {/* activateOnFocus: arrow keys choose, as in legacy, not just move focus. */}
      <BaseTabs.List activateOnFocus aria-label={label} className={s.list}>
        {items.map((i) => (
          <BaseTabs.Tab key={i.value} value={i.value} disabled={i.disabled} className={s.tab}>
            {i.label}
          </BaseTabs.Tab>
        ))}
        <BaseTabs.Indicator className={s.indicator} />
      </BaseTabs.List>
      {items.map((i) =>
        i.content != null ? (
          <BaseTabs.Panel key={i.value} value={i.value} className={s.panel}>
            {i.content}
          </BaseTabs.Panel>
        ) : null,
      )}
    </BaseTabs.Root>
  );
}
