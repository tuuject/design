import { createFileRoute, redirect } from '@tanstack/react-router';

/** The app opens on the dashboard. */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' });
  },
});
