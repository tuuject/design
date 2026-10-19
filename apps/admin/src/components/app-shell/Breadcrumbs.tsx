import { ChevronRightIcon } from '@koi/react/icons';
import { css } from '@koi/react/styled-system/css';
import { sizes } from '@koi/tokens/dimensions';
import { useMatches } from '@tanstack/react-router';
import { AppLink } from '../AppLink';

/** 首页 / 当前页, from each route's staticData.title. */
export function Breadcrumbs() {
  const matches = useMatches();
  const title = [...matches].reverse().find((match) => match.staticData.title)?.staticData.title;

  return (
    <nav aria-label="面包屑" className={css({ display: 'flex', alignItems: 'center', minW: '0', overflow: 'hidden' })}>
      <ol className={css({ display: 'flex', alignItems: 'center', gap: '1', minW: '0' })}>
        <li>
          <AppLink
            to="/dashboard"
            className={css({
              color: 'text-muted',
              whiteSpace: 'nowrap',
              transitionProperty: 'color',
              transitionDuration: 'fast',
              _hover: { color: 'text' },
            })}
          >
            首页
          </AppLink>
        </li>
        {title ? (
          <>
            <li className={css({ color: 'text-muted', display: 'flex', flexShrink: '0' })} aria-hidden="true">
              <ChevronRightIcon size={sizes['icon-sm']} />
            </li>
            <li
              className={css({
                color: 'text',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              })}
              aria-current="page"
            >
              {title}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  );
}
