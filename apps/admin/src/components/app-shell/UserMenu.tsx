import { css } from '@koi/react/styled-system/css';
import { Avatar } from '@koi/react/avatar';
import { ChevronDownIcon } from '@koi/react/icons';
import { components, sizes } from '@koi/tokens/dimensions';
import { Menu } from '@base-ui/react/menu';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../stores/auth';
import { focusRing } from './shared';

const s = {
  trigger: css({
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    height: 'control-md',
    paddingInline: '2',
    borderRadius: 'full',
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: 'fast',
    _hover: { bg: 'surface-muted' },
    _focusVisible: focusRing,
    '&[data-popup-open]': { bg: 'surface-muted' },
  }),
  name: css({ textStyle: 'body', color: 'text', display: { base: 'none', md: 'inline' }, whiteSpace: 'nowrap' }),
  chevron: css({ color: 'text-muted', display: { base: 'none', md: 'flex' } }),
  popup: css({
    minWidth: '208px',
    bg: 'surface',
    border: '1px solid {colors.border}',
    borderRadius: 'xl',
    boxShadow: 'float',
    padding: '1',
    transition: 'transform token(durations.spring) token(easings.spring), opacity token(durations.fast) token(easings.out)',
    '&[data-starting-style], &[data-ending-style]': { opacity: '0', transform: 'translateY(-4px)' },
  }),
  header: css({ display: 'flex', flexDirection: 'column', padding: '2', gap: '1' }),
  headerName: css({ textStyle: 'body', fontWeight: 'bold', color: 'text' }),
  headerEmail: css({ textStyle: 'small', color: 'text-muted' }),
  separator: css({ height: '1px', bg: 'divider', marginBlock: '1' }),
  item: css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 'control-sm',
    paddingInline: '2',
    borderRadius: 'lg',
    color: 'nav-item-text',
    textStyle: 'body',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: 'fast',
    '&[data-highlighted]': { bg: 'nav-item-hover', color: 'text' },
  }),
};

/** User dropdown in the topbar. Base UI's Menu directly — when Koi ships its own Menu, swap it in. */
export function UserMenu() {
  const user = useAuthStore((st) => st.user);
  const logout = useAuthStore((st) => st.logout);
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Menu.Root>
      <Menu.Trigger
        render={(props) => (
          <button type="button" {...props} className={s.trigger} aria-label="用户菜单">
            <Avatar name={user.name} size="sm" />
            <span className={s.name}>{user.name}</span>
            <ChevronDownIcon size={sizes['icon-sm']} className={s.chevron} />
          </button>
        )}
      />
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={components.popup.offset}>
          <Menu.Popup className={s.popup}>
            <div className={s.header}>
              <span className={s.headerName}>{user.name}</span>
              <span className={s.headerEmail}>{user.email}</span>
            </div>
            <Menu.Separator className={s.separator} />
            <Menu.Item className={s.item} onClick={() => navigate({ to: '/settings' })}>个人设置</Menu.Item>
            <Menu.Item
              className={s.item}
              onClick={() => {
                logout();
                navigate({ to: '/login' });
              }}
            >
              退出登录
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
