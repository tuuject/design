import { Menu } from '@base-ui/react/menu';
import { Avatar } from '@koi/react/avatar';
import { ChevronDownIcon } from '@koi/react/icons';
import { css } from '@koi/react/styled-system/css';
import { components, sizes } from '@koi/tokens/dimensions';
import { useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '../../stores/auth';
import { LogoutIcon, SlidersIcon } from '../icons';
import { focusRing } from './shared';

const s = {
  item: css({
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    width: '100%',
    minHeight: 'control-md',
    paddingInline: '3',
    // radius-lg inside the popup's radius-xl and 4px padding: concentric.
    borderRadius: 'lg',
    color: 'text',
    textStyle: 'body',
    cursor: 'pointer',
    outline: 'none',
    userSelect: 'none',
    transitionProperty: 'background-color',
    transitionDuration: 'fast',
    '& > svg': { flex: 'none', color: 'text-muted' },
    '&[data-highlighted]': { bg: 'surface-muted' },
  }),
};

/**
 * User dropdown in the topbar. Base UI's Menu directly — when Koi ships its own Menu, swap it in.
 * Styled after SelectPanel's panel (docs/spec/components/SelectPanel.md), the closest floating list Koi
 * specs today, so the menu reads as part of the system rather than a one-off.
 */
export function UserMenu() {
  const user = useAuthStore((st) => st.user);
  const logout = useAuthStore((st) => st.logout);
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        render={(props) => (
          <button
            type="button"
            {...props}
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
        )}
      />
      <Menu.Portal>
        <Menu.Positioner
          className={css({
            // Portaled to <body>: without a layer the sticky topbar (z-index 40) paints over the popup's top edge.
            zIndex: 'popup',
            outline: 'none',
          })}
          align="end"
          sideOffset={components.popup.offset}
        >
          <Menu.Popup
            className={css({
              minWidth: '208px',
              bg: 'surface',
              border: '1px solid {colors.border}',
              borderRadius: 'xl',
              boxShadow: 'float',
              padding: '1',
              outline: 'none',
              transformOrigin: 'var(--transform-origin)',
              transition:
                'opacity token(durations.fast) token(easings.out), transform token(durations.check) token(easings.spring)',
              '&[data-starting-style], &[data-ending-style]': { opacity: '0', transform: 'scale(.96)' },
            })}
          >
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '3',
                paddingInline: '3',
                paddingBlock: '2',
              })}
            >
              <Avatar name={user.name} size="md" />
              <div className={css({ display: 'flex', flexDirection: 'column', minWidth: '0' })}>
                <span className={css({ textStyle: 'body', fontWeight: 'bold', color: 'text' })}>{user.name}</span>
                <span className={css({ textStyle: 'small', color: 'text-muted' })}>{user.email}</span>
              </div>
            </div>
            <Menu.Separator
              className={css({
                // Edge to edge across the 4px popup padding, like SelectPanel's separators.
                height: '1px',
                bg: 'divider',
                marginBlock: '1',
                marginInline: '-1',
              })}
            />
            <Menu.Item className={s.item} onClick={() => navigate({ to: '/settings' })}>
              <SlidersIcon />
              个人设置
            </Menu.Item>
            <Menu.Item
              className={s.item}
              onClick={() => {
                logout();
                navigate({ to: '/login' });
              }}
            >
              <LogoutIcon />
              退出登录
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
