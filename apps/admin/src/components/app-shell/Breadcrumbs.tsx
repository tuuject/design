import { css } from '@koi/react/styled-system/css';
import { ChevronRightIcon } from '@koi/react/icons';
import { sizes } from '@koi/tokens/dimensions';
import { useMatches } from '@tanstack/react-router';
import { AppLink } from '../AppLink';

const s = {
  root: css({ display: 'flex', alignItems: 'center', minW: '0', overflow: 'hidden' }),
  list: css({ display: 'flex', alignItems: 'center', gap: '1', minW: '0' }),
  link: css({
    color: 'text-muted',
    whiteSpace: 'nowrap',
    transitionProperty: 'color',
    transitionDuration: 'fast',
    _hover: { color: 'text' },
  }),
  separator: css({ color: 'text-muted', display: 'flex', flexShrink: '0' }),
  current: css({ color: 'text', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
};

/** 首页 / 当前页, from each route's staticData.title. */
export function Breadcrumbs() {
  const matches = useMatches();
  const title = [...matches].reverse().find((match) => match.staticData.title)?.staticData.title;

  return (
    <nav aria-label="面包屑" className={s.root}>
      <ol className={s.list}>
        <li><AppLink to="/dashboard" className={s.link}>首页</AppLink></li>
        {title ? (
          <>
            <li className={s.separator} aria-hidden="true"><ChevronRightIcon size={sizes['icon-sm']} /></li>
            <li className={s.current} aria-current="page">{title}</li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
