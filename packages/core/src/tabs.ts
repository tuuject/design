import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details';

export interface TabItem {
  value: string;
  label: ReactNode;
  /** The panel shown while this tab is active. Leave it out on every item for a pure segmented control. */
  content?: ReactNode;
  disabled?: boolean;
}

export interface TabsOwnProps<E = unknown> {
  items: TabItem[];
  value?: string;
  /** Defaults to the first enabled item. */
  defaultValue?: string;
  /** Called with the newly chosen value when the user picks a tab. */
  onChange?: (value: string, details: ChangeDetails<E>) => void;
  /** Accessible name of the tab list (not shown). */
  label?: string;
  /** Stretch the track to the container and share its width between the tabs. */
  fullWidth?: boolean;
}
