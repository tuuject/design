import * as React from 'react';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Combobox } from '@base-ui/react/combobox';
import { cx } from '@koi/react/styled-system/css';
import { selectPanel } from '@koi/react/styled-system/recipes';
import { KoiFieldContext } from '../field/context';
import { CheckIcon, ChevronDownIcon, SearchIcon } from '../icons';
import {
  strings,
  type SelectEntry as Entry,
  type SelectGroupOwnProps,
  type SelectItemOwnProps,
  type SelectOption,
  type SelectOptionGroup,
  type SelectOptionOf as OptionOf,
  type SelectPanelOwnProps,
} from '@koi/core';

export type { SelectOptionGroup } from '@koi/core';

export interface SelectPanelProps<I extends Entry = Entry>
  extends SelectPanelOwnProps<I, Event>,
    Omit<React.ComponentPropsWithRef<'button'>, keyof SelectPanelOwnProps | 'required' | 'name' | 'type'> {
  /** Submitted with the form. */
  name?: string;
  required?: boolean;
}

const isGroup = (e: Entry): e is SelectOptionGroup => Array.isArray((e as SelectOptionGroup).items);

// SelectItem and friends render Base UI Select or Combobox parts, whichever the panel they're in uses.
const PARTS = {
  select: {
    Item: BaseSelect.Item, ItemIndicator: BaseSelect.ItemIndicator, Group: BaseSelect.Group,
    GroupLabel: BaseSelect.GroupLabel, Separator: BaseSelect.Separator,
  },
  combobox: {
    Item: Combobox.Item, ItemIndicator: Combobox.ItemIndicator, Group: Combobox.Group,
    GroupLabel: Combobox.GroupLabel, Separator: Combobox.Separator,
  },
} as const;
type Mode = keyof typeof PARTS;
const ModeContext = React.createContext<Mode | null>(null);

function useParts(part: string) {
  const mode = React.useContext(ModeContext);
  if (!mode) throw new Error(`${part} must be rendered inside a SelectPanel.`);
  // The two sets take the same props for everything used here; Select.Item's `label` is passed only to Select.
  return { mode, P: PARTS[mode] as unknown as typeof PARTS.select };
}

function defaultRender(entries: Entry[]) {
  const option = (o: SelectOption) => (
    <SelectItem key={o.value} value={o.value} label={o.label} disabled={o.disabled}>{o.label}</SelectItem>
  );
  return entries.map((e) => (isGroup(e) ? <SelectGroup key={e.label} label={e.label}>{e.items.map(option)}</SelectGroup> : option(e)));
}

/**
 * A dropdown whose panel you draw: grouped options, rich rows, a search box. Base UI provides the behavior: a
 * listbox (Base UI Select), or with `searchable` a combobox with its input inside the panel (Base UI Combobox).
 * Both open below the trigger, flip near the viewport edge and are fully keyboard accessible.
 */
export function SelectPanel<I extends Entry = Entry>({
  items, value, defaultValue, onChange, placeholder = strings.selectPlaceholder, size = 'md', invalid, name, readOnly, required, disabled,
  searchable, searchPlaceholder = strings.search, emptyText = strings.noMatches, renderValue, children, open, defaultOpen, onOpenChange,
  id, className, ...rest
}: SelectPanelProps<I>) {
  const f = React.useContext(KoiFieldContext);
  const s = selectPanel({ size });
  const flat = React.useMemo(() => (items as readonly Entry[]).flatMap((e) => (isGroup(e) ? e.items : [e])) as OptionOf<I>[], [items]);
  const render: (items: I[]) => React.ReactNode = children ?? defaultRender;

  const showValue = (v: string | null) => {
    const item = v == null ? undefined : flat.find((o) => o.value === v);
    return item ? (renderValue ? renderValue(item) : item.label) : placeholder;
  };
  const root = {
    value, defaultValue, open, defaultOpen, name, readOnly, disabled,
    required: required ?? f?.required,
    id: id ?? f?.id,
    onValueChange: onChange,
    onOpenChange,
  };
  const trigger = (P: typeof BaseSelect | typeof Combobox) => (
    <P.Trigger
      {...rest}
      aria-invalid={invalid && !disabled ? true : rest['aria-invalid']}
      className={cx(s.trigger, className)}
    >
      <span className={s.value}><P.Value>{showValue}</P.Value></span>
      <P.Icon className={s.icon}><ChevronDownIcon /></P.Icon>
    </P.Trigger>
  );

  // Base UI's Combobox filters on the labels; values stay the option's `value` strings.
  const collection = React.useMemo(
    // Typed as flat; createItems reads groups at runtime.
    () => Combobox.createItems(items as readonly SelectOption[] as SelectOption[], { getValue: (o) => o.value, getLabel: (o) => o.label }),
    [items],
  );

  if (searchable) {
    return (
      <Combobox.Root {...root} items={collection}>
        {trigger(Combobox)}
        <Combobox.Portal>
          <Combobox.Positioner align="start" sideOffset={4} className={s.positioner}>
            <Combobox.Popup className={s.popup}>
              <div className={s.search}>
                <SearchIcon />
                <Combobox.Input placeholder={searchPlaceholder} aria-label={searchPlaceholder} className={s.searchInput} />
              </div>
              <Combobox.Empty className={s.empty}>{emptyText}</Combobox.Empty>
              <Combobox.List className={s.list}>
                <ModeContext.Provider value="combobox">
                  <Filtered render={render} />
                </ModeContext.Provider>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    );
  }

  return (
    <BaseSelect.Root {...root} items={flat}>
      {trigger(BaseSelect)}
      <BaseSelect.Portal>
        {/* Below the trigger like the searchable panel, not over it (Base UI's default for Select). */}
        <BaseSelect.Positioner alignItemWithTrigger={false} align="start" sideOffset={4} className={s.positioner}>
          <BaseSelect.Popup className={s.popup}>
            <BaseSelect.List className={s.list}>
              <ModeContext.Provider value="select">{render([...items])}</ModeContext.Provider>
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

function Filtered<I extends Entry>({ render }: { render: (items: I[]) => React.ReactNode }) {
  const filtered = Combobox.useFilteredItems<I>();
  return <>{render(filtered.filter((e) => !isGroup(e) || e.items.length > 0))}</>;
}

export interface SelectItemProps extends SelectItemOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof SelectItemOwnProps> {}

/** One choosable row in a SelectPanel. A check mark shows on the chosen one. */
export function SelectItem({ value, label, disabled, className, children, ...rest }: SelectItemProps) {
  const { mode, P } = useParts('SelectItem');
  const s = selectPanel();
  return (
    <P.Item {...rest} value={value} disabled={disabled} {...(mode === 'select' ? { label } : null)} className={cx(s.item, className)}>
      <span className={s.itemText}>{children}</span>
      <P.ItemIndicator className={s.itemIndicator}><CheckIcon /></P.ItemIndicator>
    </P.Item>
  );
}

export interface SelectGroupProps extends SelectGroupOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof SelectGroupOwnProps> {}

/** A titled group of SelectItems. */
export function SelectGroup({ label, className, children, ...rest }: SelectGroupProps) {
  const { P } = useParts('SelectGroup');
  const s = selectPanel();
  return (
    <P.Group {...rest} className={cx(s.group, className)}>
      <P.GroupLabel className={s.groupLabel}>{label}</P.GroupLabel>
      {children}
    </P.Group>
  );
}

/** A line between items or groups. */
export function SelectSeparator({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { P } = useParts('SelectSeparator');
  const s = selectPanel();
  return <P.Separator {...rest} className={cx(s.separator, className)} />;
}
