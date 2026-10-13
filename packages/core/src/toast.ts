import type { ReactNode } from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'error';

/** At most this many toasts show; a newer one closes the oldest for good. */
export const TOAST_LIMIT = 4;
/** ms before a toast closes on its own, unless its options say otherwise. */
export const TOAST_DURATION = 4000;

export interface ToastOwnProps {
  /** info and success (brand icon) · warning · error. Default info. */
  tone?: ToastTone;
  title?: ReactNode;
  description?: ReactNode;
  /** Usually a small Button, at the end of the toast. */
  action?: ReactNode;
  /** Shows a close button. */
  onClose?: () => void;
}

export interface ToastOptions {
  tone?: ToastTone;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** ms before it closes on its own; 0 keeps it until it's closed. Default 4000. */
  duration?: number;
}

export interface ToastProviderOwnProps {
  children?: ReactNode;
  /** Where the stack sits, centered. Default bottom. */
  position?: 'bottom' | 'top';
}

/** What `useToast()` returns. */
export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast(options: ToastOptions): number;
  dismiss(id: number): void;
}
