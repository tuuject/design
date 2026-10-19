import { Toast as BaseToast } from '@base-ui/react/toast';
import {
  strings,
  TOAST_DURATION,
  TOAST_LIMIT,
  type ToastApi,
  type ToastOwnProps,
  type ToastProviderOwnProps,
  type ToastTone,
} from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { toast as toastRecipe } from '@koi/react/styled-system/recipes';
import * as React from 'react';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../icons';

export type { ToastOptions, ToastTone } from '@koi/core';

export interface ToastProps extends ToastOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof ToastOwnProps> {}

export interface ToastProviderProps extends ToastProviderOwnProps {}

type ToastData = { action?: React.ReactNode };

const toneIcon = { info: InfoIcon, success: SuccessIcon, warning: WarningIcon, error: ErrorIcon };

/**
 * A toast on its own, outside ToastProvider (the provider renders the same thing). Error is role="alert", the
 * other tones role="status".
 */
export function Toast({ tone = 'info', title, description, action, onClose, className, ...rest }: ToastProps) {
  const s = toastRecipe({ tone, closable: !!onClose });
  const Icon = toneIcon[tone] ?? InfoIcon;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} {...rest} className={cx(s.root, className)}>
      <span className={s.icon}>
        <Icon />
      </span>
      <div className={s.content}>
        {title ? <p className={s.title}>{title}</p> : null}
        {description ? <p className={s.description}>{description}</p> : null}
      </div>
      {action ? <div className={s.action}>{action}</div> : null}
      {onClose ? (
        <button type="button" className={s.close} aria-label={strings.close} title={strings.close} onClick={onClose}>
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}

const ToastContext = React.createContext<ToastApi | null>(null);

/**
 * Wrap the app once; then call `useToast().toast({...})` anywhere inside. Base UI's toast manager does the timing
 * (paused while the stack is hovered or focused, or the window is in the background), swipe-to-dismiss, F6 to
 * reach the toasts from the keyboard, and the screen reader announcements.
 */
export function ToastProvider({ children, position = 'bottom' }: ToastProviderProps) {
  const s = toastRecipe({ position });
  return (
    <BaseToast.Provider limit={TOAST_LIMIT} timeout={TOAST_DURATION}>
      <ToastApiProvider>{children}</ToastApiProvider>
      <BaseToast.Portal>
        <BaseToast.Viewport aria-label={strings.notifications} className={s.viewport}>
          <ToastList position={position} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

// Talks to Base UI's store through the hook rather than a createToastManager() instance: the instance only hears
// calls once the provider has subscribed in its effect, which runs after the children's, so a toast() fired from a
// child's mount effect would be lost.
function ToastApiProvider({ children }: { children?: React.ReactNode }) {
  const { add, close } = BaseToast.useToastManager<ToastData>();
  const seq = React.useRef(0);
  const api = React.useMemo<ToastApi>(
    () => ({
      toast({ tone = 'info', title, description, action, duration }) {
        const id = ++seq.current;
        add({
          id: String(id),
          type: tone,
          title,
          description,
          timeout: duration,
          // Errors are announced right away (legacy: role="alert"); the rest wait their turn.
          priority: tone === 'error' ? 'high' : 'low',
          data: { action },
        });
        return id;
      },
      dismiss(id) {
        close(String(id));
      },
    }),
    [add, close],
  );
  return <ToastContext.Provider value={api}>{children}</ToastContext.Provider>;
}

function ToastList({ position }: { position: 'bottom' | 'top' }) {
  const { toasts, close } = BaseToast.useToastManager<ToastData>();
  // At most 4 at once, and the oldest goes for good (legacy). Base UI only marks the extras `limited` and brings
  // them back when a newer one closes, so close them.
  React.useEffect(() => {
    for (const t of toasts) {
      if (t.limited && t.transitionStatus !== 'ending') {
        close(t.id);
      }
    }
  }, [toasts, close]);

  return toasts.map((t) => {
    const tone = (t.type ?? 'info') as ToastTone;
    const s = toastRecipe({ tone, closable: true, position });
    const Icon = toneIcon[tone] ?? InfoIcon;
    return (
      <BaseToast.Root
        key={t.id}
        toast={t}
        swipeDirection={[position === 'top' ? 'up' : 'down', 'left', 'right']}
        className={s.root}
      >
        <span className={s.icon}>
          <Icon />
        </span>
        <div className={s.content}>
          <BaseToast.Title className={s.title} render={<p />} />
          <BaseToast.Description className={s.description} />
        </div>
        {t.data?.action ? <div className={s.action}>{t.data.action}</div> : null}
        <BaseToast.Close className={s.close} aria-label={strings.close} title={strings.close}>
          <CloseIcon />
        </BaseToast.Close>
      </BaseToast.Root>
    );
  });
}

/** `toast(options)` shows one and returns its id; `dismiss(id)` closes it. Only inside ToastProvider. */
export function useToast(): ToastApi {
  const api = React.useContext(ToastContext);
  if (!api) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return api;
}
