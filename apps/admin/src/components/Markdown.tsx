import { css } from '@koi/react/styled-system/css';
import ReactMarkdown from 'react-markdown';

// The assistant's replies, rendered flat on the page: no bubble, just long-form prose (`prose`, 16px —
// everything else in the app is `body`). Block spacing is explicit because the UA default margins are
// neither on the spacing scale nor consistent between block types.
const styles = css({
  color: 'text',
  fontFamily: 'sans',
  textStyle: 'prose',
  minWidth: '0',
  '& > :first-child': { marginBlockStart: '0' },
  '& > :last-child': { marginBlockEnd: '0' },
  '& p, & ul, & ol, & blockquote, & pre': { marginBlockStart: '0', marginBlockEnd: '3' },
  '& h1, & h2': { textStyle: 'heading-2', marginBlockStart: '4', marginBlockEnd: '2' },
  '& h3, & h4': { textStyle: 'heading-3', marginBlockStart: '4', marginBlockEnd: '2' },
  '& ul, & ol': { paddingInlineStart: '5' },
  // The global reset removes list markers everywhere; markdown prose puts them back.
  '& ul': { listStyleType: 'disc' },
  '& ol': { listStyleType: 'decimal' },
  '& li': { marginBlockEnd: '1', '&::marker': { color: 'text-muted' } },
  '& a': { color: 'link', textDecoration: 'underline', textUnderlineOffset: '2' },
  '& strong': { fontWeight: 'bold' },
  '& code': {
    fontFamily: '[ui-monospace, SFMono-Regular, Menlo, Consolas, monospace]',
    fontSize: '[0.875em]',
    bg: 'surface-muted',
    paddingInline: '1',
    borderRadius: 'sm',
  },
  '& pre': {
    bg: 'surface-muted',
    padding: '3',
    borderRadius: 'lg',
    overflowX: 'auto',
    '& code': { bg: 'transparent', paddingInline: '0' },
  },
  '& blockquote': {
    borderInlineStartWidth: '[3px]',
    borderInlineStartStyle: 'solid',
    borderColor: 'border',
    paddingInlineStart: '3',
    color: 'text-muted',
  },
});

/** Renders a reply's markdown as flat prose (headings, lists, code, quotes — the reply-writing basics). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className={styles}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
