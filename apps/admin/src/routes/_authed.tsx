import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppShell } from '../components/app-shell/AppShell';
import { useAuthStore } from '../stores/auth';

/** Pathless layout for everything behind the login: guards, then renders the app shell. */
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().user) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: AppShell,
});
