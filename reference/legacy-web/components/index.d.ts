import type * as React from 'react';

type Size = 'sm' | 'md' | 'lg';
type Tone = 'info' | 'warning' | 'error';
/** Which color family a Button or IconButton uses. */
export type ButtonColor = 'primary' | 'accent' | 'secondary' | 'warning' | 'error';
/** How that color is applied: solid fill, soft tinted fill, outline, or text only. */
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost';
/** Earlier variant names, still accepted: primary = solid, secondary = soft, danger = solid + color error. */
type LegacyButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** primary (sky) · accent (amber) · secondary (gray) · warning (yellow) · error (red). Default primary. */
  color?: ButtonColor;
  /** solid · soft · outline · ghost. Default solid. */
  variant?: ButtonVariant | LegacyButtonVariant;
  /** sm 32px · md 40px · lg 48px. Default md. */
  size?: Size;
  /** pill (default, `radius-full`) or rounded (`radius-lg`, 8px: Tailwind `rounded-lg`). Inside a Dialog footer the default is rounded. */
  shape?: 'pill' | 'rounded';
  /** Shows a spinner, disables the button and sets aria-busy. */
  loading?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
  /** Renders an <a> instead of a <button>. */
  href?: string;
}
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** Required accessible name; also the native tooltip. */
  label: string;
  icon: React.ReactNode;
  /** Default secondary (gray). */
  color?: ButtonColor;
  /** Default ghost. */
  variant?: ButtonVariant | LegacyButtonVariant;
  /** sm 32px · md 40px · lg 48px. Default md. */
  size?: Size;
  /** pill (default, round) or rounded (`radius-lg`, 8px corners). Inside a Dialog footer the default is rounded. */
  shape?: 'pill' | 'rounded';
}
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Opens in a new tab with rel="noopener noreferrer" and an external-link glyph. */
  external?: boolean;
}
export declare function Link(props: LinkProps): React.ReactElement;

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  /** Red edge and aria-invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
}
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { invalid?: boolean }
export declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options?: SelectOption[];
  /** A disabled first option shown until the user picks. */
  placeholder?: string;
  size?: Size;
  invalid?: boolean;
}
export declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
}
export declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

export interface RadioOption { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean }
export interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible name of the group (or wrap it in a Field). */
  label?: string;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
}
export declare function RadioGroup(props: RadioGroupProps): React.ReactElement;

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}
export declare function Switch(props: SwitchProps): React.ReactElement;

export interface FieldProps {
  label?: React.ReactNode;
  /** Shown under the control in text-muted. */
  help?: React.ReactNode;
  /** Shown under the control in error-text; marks the control invalid. */
  error?: React.ReactNode;
  required?: boolean;
  /** Appends "（选填）" to the label. */
  optional?: boolean;
  id?: string;
  /** One Input, Textarea or Select; it receives id, aria-describedby and aria-invalid. */
  children: React.ReactNode;
  className?: string;
}
export declare function Field(props: FieldProps): React.ReactElement;

export interface AlertProps {
  tone?: Tone;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Replaces the tone icon; null hides it. */
  icon?: React.ReactNode | null;
  action?: React.ReactNode;
  /** Shows a close button. */
  onClose?: () => void;
  className?: string;
}
export declare function Alert(props: AlertProps): React.ReactElement;

export interface BadgeProps {
  tone?: 'neutral' | 'primary' | 'accent' | 'warning' | 'error' | 'solid';
  dot?: boolean;
  children?: React.ReactNode;
  className?: string;
}
export declare function Badge(props: BadgeProps): React.ReactElement;

export interface TagProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  /** Shows a remove (×) button. */
  onRemove?: () => void;
  className?: string;
}
export declare function Tag(props: TagProps): React.ReactElement;

export interface ToastProps {
  tone?: Tone | 'success';
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}
export declare function Toast(props: ToastProps): React.ReactElement;
export interface ToastOptions extends Omit<ToastProps, 'onClose' | 'className'> {
  /** ms before auto-dismiss; 0 keeps it. Default 4000. */
  duration?: number;
}
export declare function ToastProvider(props: { children?: React.ReactNode; position?: 'bottom' | 'top' }): React.ReactElement;
export declare function useToast(): { toast(options: ToastOptions): number; dismiss(id: number): void };

export interface ProgressProps {
  /** Omit for an indeterminate bar. */
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: Size;
  className?: string;
}
export declare function Progress(props: ProgressProps): React.ReactElement;

export interface SpinnerProps { size?: Size; label?: string; className?: string }
export declare function Spinner(props: SpinnerProps): React.ReactElement;

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Default 'div'; use 'span' inside text. */
  as?: keyof JSX.IntrinsicElements;
  /** Optional: real or placeholder content to size the skeleton by. It is kept in layout but hidden. */
  children?: React.ReactNode;
}
/** Only the fill and shimmer. Set width, height, border-radius and layout with your own className or style. Always aria-hidden. */
export declare function Skeleton(props: SkeletonProps): React.ReactElement;

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** outlined (default) · filled · glass (Koi's frosted panel: put it over imagery or color). */
  variant?: 'outlined' | 'filled' | 'glass';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Full-bleed content above the head, e.g. an <img>. */
  media?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'default' | 'none';
}
export declare function Card(props: CardProps): React.ReactElement;

export interface TabItem { value: string; label: React.ReactNode; content?: React.ReactNode; disabled?: boolean }
export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  className?: string;
}
export declare function Tabs(props: TabsProps): React.ReactElement;

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** Action buttons. Buttons here default to shape="rounded". */
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** 'alertdialog' for confirmations that need an answer. */
  role?: 'dialog' | 'alertdialog';
  /** false: clicking the backdrop does not close it. */
  dismissible?: boolean;
  /** Render in place instead of a portal to document.body. */
  inline?: boolean;
  className?: string;
}
export declare function Dialog(props: DialogProps): React.ReactElement | null;

export interface TooltipProps {
  content: React.ReactNode;
  /** One focusable element. */
  children: React.ReactElement;
  side?: 'top' | 'bottom';
  /** Force open (controlled). */
  open?: boolean;
}
export declare function Tooltip(props: TooltipProps): React.ReactElement;

export interface AvatarProps {
  src?: string;
  /** Alt text and the source of the fallback initials (first character for CJK names). */
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  className?: string;
}
export declare function Avatar(props: AvatarProps): React.ReactElement;

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange?: (page: number) => void;
  /** numbered (default) or simple: the blog's two pills and "n / m". */
  variant?: 'numbered' | 'simple';
  prevLabel?: string;
  nextLabel?: string;
  siblings?: number;
  label?: string;
  className?: string;
}
export declare function Pagination(props: PaginationProps): React.ReactElement;

export interface DividerProps { orientation?: 'horizontal' | 'vertical'; label?: React.ReactNode; className?: string }
export declare function Divider(props: DividerProps): React.ReactElement;

export interface NavItem {
  /** Unique key; matched against `value` to mark the current item. */
  value: string;
  label: React.ReactNode;
  /** A 24-grid line icon drawn in currentColor. */
  icon?: React.ReactNode;
  /** Renders an <a>; without it the item is a <button>. Ignored on items with children, which open and close instead. */
  href?: string;
  /** Trailing content, e.g. a Badge with a count. */
  badge?: React.ReactNode;
  disabled?: boolean;
  /** Sub-items. Up to three levels in all: vertical expands them in place, horizontal opens cascading panels. */
  children?: NavItem[];
}
export interface NavSection {
  /** Small muted heading ("观察", "管理"); read by screen readers only in the horizontal bar. */
  label?: React.ReactNode;
  items: NavItem[];
}
export interface NavMenuProps {
  /** vertical (sidebar, default) or horizontal (top bar). Same data either way. */
  orientation?: 'vertical' | 'horizontal';
  /** Grouped items. Use `items` instead for a single ungrouped list. */
  sections?: NavSection[];
  items?: NavItem[];
  /** The current item's value (controlled). */
  value?: string;
  defaultValue?: string;
  /** Fires when a leaf item is chosen (parents only open and close). */
  onSelect?: (value: string, item: NavItem, event: React.MouseEvent) => void;
  /** Vertical: parents expanded at first. The current item's parents always open. */
  defaultExpanded?: string[];
  /** Logo box, product name and an optional line under it; `href` makes it a link home. */
  brand?: { logo?: React.ReactNode; title: React.ReactNode; subtitle?: React.ReactNode; href?: string };
  /** Pinned to the bottom (vertical) or the end (horizontal), e.g. a user Avatar. */
  footer?: React.ReactNode;
  /** aria-label of the <nav>. Default "主导航". */
  label?: string;
  /** aria-current value for the current item. Default "page". */
  current?: 'page' | 'location' | 'true';
  className?: string;
}
export declare function NavMenu(props: NavMenuProps): React.ReactElement;

export declare const Icons: Record<'check' | 'close' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'info' | 'warning' | 'error' | 'success' | 'external', (size?: number) => React.ReactElement>;

declare global {
  interface Window {
    Koi: {
      Button: typeof Button; IconButton: typeof IconButton; Link: typeof Link; Input: typeof Input; Textarea: typeof Textarea;
      Select: typeof Select; Checkbox: typeof Checkbox; RadioGroup: typeof RadioGroup; Switch: typeof Switch; Field: typeof Field;
      Alert: typeof Alert; Badge: typeof Badge; Tag: typeof Tag; Toast: typeof Toast; ToastProvider: typeof ToastProvider;
      useToast: typeof useToast; Progress: typeof Progress; Spinner: typeof Spinner; Skeleton: typeof Skeleton; Card: typeof Card; Tabs: typeof Tabs;
      Dialog: typeof Dialog; Tooltip: typeof Tooltip; Avatar: typeof Avatar; Pagination: typeof Pagination; Divider: typeof Divider; NavMenu: typeof NavMenu;
      Icons: typeof Icons;
    };
  }
}
