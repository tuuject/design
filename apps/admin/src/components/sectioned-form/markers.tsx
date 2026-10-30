import { ErrorIcon } from '@koi/react/icons';
import { css } from '@koi/react/styled-system/css';
import { sizes } from '@koi/tokens/dimensions';

// Unsaved and invalid look different in shape, not just color: a small brand dot for "changed", the error icon for
// "needs fixing". Each also carries words for screen readers, since the marks themselves are hidden from them.

const srOnly = css({ srOnly: true });

export function ChangedDot({ label }: { label?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className={css({
          // Badge's status dot size.
          flex: 'none',
          width: '6px',
          height: '6px',
          borderRadius: 'full',
          bg: 'text-brand',
        })}
      />
      {label ? <span className={srOnly}>{label}</span> : null}
    </>
  );
}

export function InvalidMark({ label }: { label?: string }) {
  return (
    <>
      <ErrorIcon size={sizes['icon-sm']} className={css({ flex: 'none', color: 'error-text' })} />
      {label ? <span className={srOnly}>{label}</span> : null}
    </>
  );
}
