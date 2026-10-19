import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { routeTree } from './routeTree.gen';
import { useUiStore } from './stores/ui';
// ChillRoundF subsets; only fetched when <html data-font="chill"> (theme-init handles the attribute).
import '@koi/tokens/fonts.css';
import './index.css';

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Any page change closes the mobile drawer, including back / forward, which no click handler sees.
router.subscribe('onResolved', ({ pathChanged }) => {
  if (pathChanged) {
    useUiStore.getState().setMobileNavOpen(false);
  }
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Missing #root element');
}
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
