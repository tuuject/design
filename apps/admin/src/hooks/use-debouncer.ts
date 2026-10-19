import { useState } from 'react';
import { useMountEffect } from './use-mount-effect';

/**
 * A debouncer for event handlers: `run(fn)` calls the latest `fn` after `ms` of quiet, `cancel()` drops it.
 * The callback is passed per call rather than to the hook, so it never goes stale. A pending call is
 * dropped on unmount.
 */
export function useDebouncer(ms: number) {
  const [debouncer] = useState(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => clearTimeout(timer);
    return {
      run: (fn: () => void) => {
        cancel();
        timer = setTimeout(fn, ms);
      },
      cancel,
    };
  });
  useMountEffect(() => debouncer.cancel);
  return debouncer;
}
