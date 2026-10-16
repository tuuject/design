import * as React from 'react';
import { Outlet, createRootRoute, useMatches } from '@tanstack/react-router';
import { ToastProvider } from '@koi/react/toast';

// Every route carries an optional page title; the shell reads it for the breadcrumb and document title.
declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    title?: string;
  }
}

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  const matches = useMatches();
  const title = [...matches].reverse().find((match) => match.staticData.title)?.staticData.title;

  React.useEffect(() => {
    document.title = title ? `${title} · Koi Admin` : 'Koi Admin';
  }, [title]);

  // One ToastProvider around everything: login, the shell and dialogs all toast.
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  );
}
