import { Avatar } from '@tuuject/koi-react/avatar';
import { ChevronDownIcon } from '@tuuject/koi-react/icons';
import { Menu } from '@tuuject/koi-react/menu';
import { css } from '@tuuject/koi-react/styled-system/css';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../stores/auth';
import { LogoutIcon, SlidersIcon } from '../icons';
import { focusRing } from './shared';

/**
 * User dropdown in the topbar: Koi's Menu, so the panel is the same one NavFlyout and the change summary use.
 * The trigger stays the template's own button (avatar, name, chevron) — Menu only adds the popup and the
 * keyboard behavior.
 */
export function UserMenu() {
  const user = useAuthStore((st) => st.user);
  const logout = useAuthStore((st) => st.logout);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Menu
      placement="bottom-end"
      trigger={
        <button
          type="button"
          className={css({
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            height: 'control-md',
            // 4px around the 28px avatar on every side keeps it concentric with the 36px pill.
            paddingInlineStart: '1',
            paddingInlineEnd: '3',
            borderRadius: 'full',
            cursor: 'pointer',
            transitionProperty: 'background-color',
            transitionDuration: 'fast',
            _hover: { bg: 'surface-muted' },
            _focusVisible: focusRing,
            '&[data-popup-open]': { bg: 'surface-muted' },
          })}
          aria-label="用户菜单"
        >
          <Avatar name={user.name} size="sm" />
          <span
            className={css({
              textStyle: 'body',
              color: 'text',
              display: { base: 'none', md: 'inline' },
              whiteSpace: 'nowrap',
            })}
          >
            {user.name}
          </span>
          <ChevronDownIcon
            size={sizes['icon-sm']}
            className={css({
              color: 'text-muted',
              display: { base: 'none', md: 'flex' },
              transition: 'transform token(durations.check) token(easings.spring)',
              '[data-popup-open] > &': { transform: 'rotate(180deg)' },
            })}
          />
        </button>
      }
      header={
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          <Avatar name={user.name} size="md" />
          <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
            <span className={css({ textStyle: 'body', fontWeight: 'bold', color: 'text' })}>{user.name}</span>
            <span className={css({ textStyle: 'small', color: 'text-muted' })}>{user.email}</span>
          </div>
        </div>
      }
      items={[
        { value: 'settings', label: '个人设置', icon: <SlidersIcon /> },
        { value: 'logout', label: '退出登录', icon: <LogoutIcon /> },
      ]}
      onSelect={(value) => {
        if (value === 'settings') {
          navigate({ to: '/settings' });
          return;
        }
        logout();
        navigate({ to: '/login' });
      }}
    />
  );
}
