import { Link, type LinkProps } from '@koi/react/link';
import { useNavigate } from '@tanstack/react-router';

/** Koi Link wired to the router: the same look, client-side navigation. `to` is a literal route path. */
export function AppLink({ to, onClick, ...rest }: LinkProps & { to: '/dashboard' | '/orders' | '/settings' }) {
  const navigate = useNavigate();
  return (
    <Link
      href={to}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          navigate({ to });
        }
      }}
    />
  );
}
