import { css } from '@koi/react/styled-system/css';

// Shared layout for the matrix stories: one labelled row per variant or state.
export const stack = css({ display: 'flex', flexDirection: 'column', gap: '4' });
export const row = css({ display: 'flex', gap: '3', flexWrap: 'wrap', alignItems: 'center' });
export const label = css({ textStyle: 'small', color: 'text-muted', width: '[88px]' });
