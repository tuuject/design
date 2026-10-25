import { ToastProvider } from '@koi/react/toast';
import { createRootRoute, Outlet, useMatches } from '@tanstack/react-router';

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

  // One ToastProvider around everything: login, the shell and dialogs all toast.
  // React hoists <title> into <head>; the HTML template has none, so this is the only one.
  return (
    <ToastProvider>
      <title>{title ? `${title} - Koi Admin` : 'Koi Admin'}</title>
      <Outlet />
    </ToastProvider>
  );
}
