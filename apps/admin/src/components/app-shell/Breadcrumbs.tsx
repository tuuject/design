import type { ChangeDetails } from '@tuuject/koi-react';
import { Breadcrumb, type BreadcrumbItem } from '@tuuject/koi-react/breadcrumb';
import { useMatches, useNavigate } from '@tanstack/react-router';

/**
 * 首页 / current page, from each route's `staticData.title`, rendered by the library's Breadcrumb. The route
 * adapter stays here: the library only knows items and an `onSelect`, so the trail is built from the router's
 * matches and the home link is routed on a plain left click. A modified click falls through to the real `<a>`,
 * so opening the dashboard in a new tab still works.
 */
export function Breadcrumbs() {
  const matches = useMatches();
  const navigate = useNavigate();
  const title = [...matches].reverse().find((match) => match.staticData.title)?.staticData.title;

  const home: BreadcrumbItem<Event> = {
    label: '首页',
    href: '/dashboard',
    onSelect: (details: ChangeDetails) => {
      const event = details.event as MouseEvent;
      // Let a modified click follow the real anchor: a new tab is not a client-side navigation.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      event.preventDefault();
      navigate({ to: '/dashboard' });
    },
  };
  const items: BreadcrumbItem<Event>[] = title ? [home, { label: title, current: true }] : [home];

  return <Breadcrumb items={items} />;
}
