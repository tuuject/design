import { Prose } from '@koi/react/prose';
import ReactMarkdown from 'react-markdown';

/** Renders a reply's markdown flat on the page: no bubble, just Koi's long-form type (Prose at the 14px UI base). */
export function Markdown({ children }: { children: string }) {
  return (
    <Prose size="sm">
      <ReactMarkdown>{children}</ReactMarkdown>
    </Prose>
  );
}
