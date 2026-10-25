export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerOwnProps {
  /** sm 16 / md 20 / lg 32. Default md. */
  size?: SpinnerSize;
  /** Accessible name. Default "加载中". */
  label?: string;
}
