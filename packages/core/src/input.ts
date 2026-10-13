import type { ReactNode } from 'react';
import type { ControlSize } from './common';

// The text itself (value, change handler) is the platform's: an <input> on the web, a TextInput on native.

export interface InputOwnProps {
  /** sm 28px · md 36px · lg 44px, the same heights as Button. Default md. */
  size?: ControlSize;
  /** Red edge, announced as invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
}

export interface TextareaOwnProps {
  /** Red edge, announced as invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
}
