export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressOwnProps {
  /** 0–`max`. Omit (or pass null) for an indeterminate bar. */
  value?: number | null;
  /** Default 100. */
  max?: number;
  /** Shown above the bar and used as its accessible name. Without it the bar is named "进度". */
  label?: string;
  /** Show the rounded percentage at the end of the head row (determinate bars only). */
  showValue?: boolean;
  /** Track height: sm 4px, md 8px (default), lg 12px. */
  size?: ProgressSize;
}
