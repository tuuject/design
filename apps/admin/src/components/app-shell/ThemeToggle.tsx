import { IconButton } from '@koi/react/button';
import { MoonIcon, SunIcon } from '../icons';
import { useTheme } from '../../hooks/use-theme';

/** Light / dark toggle in the topbar; the state itself lives in theme-init.js (<html data-theme>). */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <IconButton
      size="sm"
      icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
      onClick={toggle}
    />
  );
}
