import * as React from 'react';

/**
 * Light / dark state for the shell. The source of truth is theme-init.js (localStorage "koi-theme"
 * or the OS setting, applied as <html data-theme>); this hook only mirrors it for icons and labels.
 */
export function useTheme() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  );

  React.useEffect(() => {
    // While on "follow the OS", a system flip must update the toggle. theme-init re-applies on change.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const toggle = React.useCallback(() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    window.koiSetTheme?.(next);
    setTheme(next);
  }, []);

  return { theme, toggle };
}
