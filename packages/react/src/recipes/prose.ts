import { components as c } from '@koi/tokens/dimensions';
import { defineRecipe } from '@pandacss/dev';
import { linkStyle } from './link';

// docs/spec/components/Prose.md. The blog's article styling (MarkdownBody.astro: Tailwind Typography's `prose`
// with `prose-slate` and Koi's overrides) as one recipe. Every size and gap inside is em, so the whole block scales
// from the root's font size: `size` picks 14px or 16px, and a consumer's own font size works the same way.
// Each em(px, base) is the blog's px value at 16px over the font size of the element it lands on, the way
// Tailwind Typography writes it.
const ratio = (px: number, base: number) => String(Number((px / base).toFixed(7)));
const em = (px: number, base: number) => `${ratio(px, base)}em`;

// Content wrapped in `koi-not-prose` (an embedded component, a demo) is left alone. Specificity 0, so it never
// changes which rule wins.
const NOT_PROSE = ':not(:where(.koi-not-prose *, .koi-not-prose))';
// Element rules: `.koi-prose :where(p)` stays at one class, so a class on the element itself still wins.
const el = (sel: string, pseudo = '') => `& :where(${sel})${NOT_PROSE}${pseudo}` as const;
// Contextual overrides (`pre code`, `h2 + *`, `ol[type="a"]`): plain selectors, so they outrank the element rules
// whatever order Panda emits them in (it doesn't keep source order for nested selectors).
const ctx = (...sels: string[]) => sels.map((s) => `& ${s}${NOT_PROSE}`).join(', ') as `& ${string}`;

// First and last child drop their outer margin. Written into every size so they land in the variants layer and
// beat `.lead` and the other contextual rules without a specificity race.
const edges = {
  '& > :first-child': { marginTop: '0' },
  '& > :last-child': { marginBottom: '0' },
} as const;

const listTypes: Record<`& ${string}`, { listStyleType: string }> = Object.fromEntries(
  (
    [
      ['A', 'upper-alpha'],
      ['a', 'lower-alpha'],
      ['I', 'upper-roman'],
      ['i', 'lower-roman'],
      ['1', 'decimal'],
    ] as const
  ).map(([type, style]) => [ctx(`ol[type="${type}"]`), { listStyleType: style }]),
);

export const prose = defineRecipe({
  className: 'koi-prose',
  base: {
    color: 'prose-text',
    fontFamily: 'sans',
    minWidth: '0',

    [el('p')]: { marginTop: em(20, 16), marginBottom: em(20, 16) },
    [ctx('.lead')]: {
      color: 'text-muted',
      fontSize: em(20, 16),
      lineHeight: ratio(32, 20),
      marginTop: em(24, 20),
      marginBottom: em(24, 20),
    },

    [el('a')]: { ...linkStyle, fontWeight: '500' },
    [el('strong')]: { color: 'text', fontWeight: '600' },
    [ctx('a strong', 'blockquote strong', 'thead th strong')]: { color: 'inherit' },

    // Headings. h1-h4 are the blog's; h5 and h6 continue the scale down.
    [el('h1')]: {
      color: 'text',
      fontWeight: '800',
      fontSize: em(36, 16),
      marginTop: '0',
      marginBottom: em(32, 36),
      lineHeight: ratio(40, 36),
    },
    [el('h2')]: {
      color: 'text',
      fontWeight: '700',
      fontSize: em(24, 16),
      marginTop: em(48, 24),
      marginBottom: em(24, 24),
      lineHeight: ratio(32, 24),
    },
    [el('h3')]: {
      color: 'text',
      fontWeight: '600',
      fontSize: em(20, 16),
      marginTop: em(32, 20),
      marginBottom: em(12, 20),
      lineHeight: ratio(32, 20),
    },
    [el('h4')]: {
      color: 'text',
      fontWeight: '600',
      fontSize: '1em',
      marginTop: em(24, 16),
      marginBottom: em(8, 16),
      lineHeight: ratio(24, 16),
    },
    [el('h5')]: {
      color: 'text',
      fontWeight: '600',
      fontSize: em(14, 16),
      marginTop: em(24, 14),
      marginBottom: em(8, 14),
      lineHeight: ratio(20, 14),
    },
    [el('h6')]: {
      color: 'text-muted',
      fontWeight: '600',
      fontSize: em(14, 16),
      marginTop: em(24, 14),
      marginBottom: em(8, 14),
      lineHeight: ratio(20, 14),
    },
    [ctx('h1 strong')]: { fontWeight: '900', color: 'inherit' },
    [ctx('h2 strong')]: { fontWeight: '800', color: 'inherit' },
    [ctx('h3 strong', 'h4 strong', 'h5 strong', 'h6 strong')]: { fontWeight: '700', color: 'inherit' },
    [ctx('hr + *', 'h2 + *', 'h3 + *', 'h4 + *', 'h5 + *', 'h6 + *')]: { marginTop: '0' },

    // Lists. The reset strips markers everywhere; prose puts them back.
    [el('ol')]: {
      listStyleType: 'decimal',
      marginTop: em(20, 16),
      marginBottom: em(20, 16),
      paddingInlineStart: em(26, 16),
    },
    [el('ul')]: {
      listStyleType: 'disc',
      marginTop: em(20, 16),
      marginBottom: em(20, 16),
      paddingInlineStart: em(26, 16),
    },
    ...listTypes,
    // The blog tightens items to 2px (`prose-li:my-0.5`).
    [el('li')]: { marginTop: em(2, 16), marginBottom: em(2, 16) },
    [el('ol > li')]: { paddingInlineStart: em(6, 16) },
    [el('ul > li')]: { paddingInlineStart: em(6, 16) },
    // Markers in text-muted: the blog's slate-300 bullets miss 3:1.
    [el('ol > li', '::marker')]: { fontWeight: '400', color: 'text-muted' },
    [el('ul > li', '::marker')]: { color: 'text-muted' },
    [ctx('> ul > li p', '> ol > li p')]: { marginTop: em(12, 16), marginBottom: em(12, 16) },
    [ctx('> ul > li > p:first-child', '> ol > li > p:first-child')]: { marginTop: em(20, 16) },
    [ctx('> ul > li > p:last-child', '> ol > li > p:last-child')]: { marginBottom: em(20, 16) },
    [ctx('ul ul', 'ul ol', 'ol ul', 'ol ol')]: { marginTop: em(12, 16), marginBottom: em(12, 16) },

    [el('dl')]: { marginTop: em(20, 16), marginBottom: em(20, 16) },
    [el('dt')]: { color: 'text', fontWeight: '600', marginTop: em(20, 16) },
    [el('dd')]: { marginTop: em(8, 16), paddingInlineStart: em(26, 16) },

    [el('hr')]: {
      borderColor: 'border',
      borderTopWidth: `${c.stroke.hairline}px`,
      marginTop: em(48, 16),
      marginBottom: em(48, 16),
    },

    [el('blockquote')]: {
      fontWeight: '500',
      fontStyle: 'italic',
      color: 'text',
      borderInlineStartWidth: `${c.prose.quoteRule}px`,
      borderInlineStartColor: 'border',
      quotes: '"\\201C""\\201D""\\2018""\\2019"',
      marginTop: em(32, 20),
      marginBottom: em(32, 20),
      paddingInlineStart: em(20, 20),
    },
    [el('blockquote p:first-of-type', '::before')]: { content: 'open-quote' },
    [el('blockquote p:last-of-type', '::after')]: { content: 'close-quote' },

    // Media. The blog rounds images (`prose-img:rounded-lg`).
    [el('img')]: { borderRadius: 'lg', marginTop: em(32, 16), marginBottom: em(32, 16) },
    [el('picture')]: { display: 'block', marginTop: em(32, 16), marginBottom: em(32, 16) },
    [ctx('picture > img')]: { marginTop: '0', marginBottom: '0' },
    [el('video')]: { marginTop: em(32, 16), marginBottom: em(32, 16) },
    [el('figure')]: { marginTop: em(32, 16), marginBottom: em(32, 16) },
    [ctx('figure > *')]: { marginTop: '0', marginBottom: '0' },
    [el('figcaption')]: {
      color: 'text-muted',
      fontSize: em(14, 16),
      lineHeight: ratio(20, 14),
    },
    // Outranks `figure > *`.
    [ctx('figure > figcaption')]: { marginTop: em(12, 14) },

    // Inline code keeps Tailwind Typography's backticks.
    [el('code')]: { color: 'text', fontWeight: '600', fontSize: em(14, 16) },
    [el('code', '::before')]: { content: '"`"' },
    [el('code', '::after')]: { content: '"`"' },
    [ctx(
      'a code',
      'h1 code',
      'h2 code',
      'h3 code',
      'h4 code',
      'h5 code',
      'h6 code',
      'blockquote code',
      'thead th code',
    )]: { color: 'inherit' },
    [ctx('h2 code')]: { fontSize: em(21, 24) },
    [ctx('h3 code')]: { fontSize: em(18, 20) },

    [el('kbd')]: {
      fontWeight: '500',
      fontFamily: 'inherit',
      color: 'text',
      fontSize: em(14, 16),
      borderRadius: em(5, 14),
      boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.divider}, 0 ${c.prose.kbdDepth}px 0 {colors.divider}`,
      paddingTop: em(3, 16),
      paddingInlineEnd: em(6, 16),
      paddingBottom: em(3, 16),
      paddingInlineStart: em(6, 16),
      // The blog's spacing fix: keys side by side don't touch.
      marginInline: em(2, 14),
    },
    // A key combination (<kbd><kbd>Ctrl</kbd>+<kbd>C</kbd></kbd>) gets room around its inner keys.
    [ctx('kbd:has(kbd)')]: { padding: em(8, 14) },

    [el('pre')]: {
      color: 'code-block-text',
      bg: 'code-block-bg',
      overflowX: 'auto',
      fontWeight: '400',
      fontSize: em(14, 16),
      lineHeight: ratio(24, 14),
      marginTop: em(24, 14),
      marginBottom: em(24, 14),
      borderRadius: 'sm',
      paddingTop: em(12, 14),
      paddingInlineEnd: em(16, 14),
      paddingBottom: em(12, 14),
      paddingInlineStart: em(16, 14),
    },
    [ctx('pre code')]: {
      bg: 'transparent',
      borderWidth: '0',
      borderRadius: '0',
      padding: '0',
      fontWeight: 'inherit',
      color: 'inherit',
      fontSize: 'inherit',
      fontFamily: 'inherit',
      lineHeight: 'inherit',
    },
    [`${ctx('pre code')}::before, ${ctx('pre code')}::after`]: { content: 'none' },

    // Tables. The blog sets cells to the body size on a 32px line (`prose-td:text-base prose-td:leading-8`) and
    // doubles the head rule.
    [el('table')]: {
      width: '100%',
      tableLayout: 'auto',
      fontSize: em(14, 16),
      lineHeight: ratio(24, 14),
      marginTop: em(32, 16),
      marginBottom: em(32, 16),
    },
    [el('thead')]: { borderBottomWidth: `${c.prose.headRule}px`, borderBottomColor: 'border' },
    [el('th')]: { fontSize: em(16, 14), lineHeight: ratio(32, 16), textAlign: 'start' },
    [el('td')]: { fontSize: em(16, 14), lineHeight: ratio(32, 16), textAlign: 'start' },
    [ctx('thead th')]: {
      color: 'text',
      fontWeight: '600',
      verticalAlign: 'bottom',
      paddingInlineEnd: em(8, 14),
      paddingBottom: em(8, 14),
      paddingInlineStart: em(8, 14),
    },
    [ctx('tbody tr')]: { borderBottomWidth: `${c.stroke.hairline}px`, borderBottomColor: 'border' },
    [ctx('tbody td')]: { verticalAlign: 'baseline' },
    [ctx('tfoot')]: { borderTopWidth: `${c.stroke.hairline}px`, borderTopColor: 'border' },
    [ctx('tfoot td')]: { verticalAlign: 'top' },
    [ctx('tbody td', 'tfoot td')]: { padding: em(8, 14) },
    [ctx('thead th:first-child', 'tbody td:first-child', 'tfoot td:first-child')]: { paddingInlineStart: '0' },
    [ctx('thead th:last-child', 'tbody td:last-child', 'tfoot td:last-child')]: { paddingInlineEnd: '0' },
    [ctx('tbody tr:last-child')]: { borderBottomWidth: '0' },
  },
  variants: {
    size: {
      // `body`'s size on `prose`'s line height. Unitless, so every element inside keeps its own leading.
      sm: { textStyle: 'body', lineHeight: ratio(28, 16), ...edges },
      md: { textStyle: 'prose', ...edges },
    },
  },
  defaultVariants: { size: 'md' },
});
