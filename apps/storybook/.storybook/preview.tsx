import '@tuuject/koi-tokens/theme-init.js'; // sets <html data-theme> from the OS (in an app, inline it in <head> to avoid a flash)
import '@tuuject/koi-tokens/fonts.css'; // ChillRoundF subsets; only used with <html data-font="chill">
import '../src/index.css';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Preview } from '@storybook/react-vite';
import { DirectionProvider } from '@tuuject/koi-react';
import type { PropsWithChildren } from 'react';
import { themes } from 'storybook/theming';

/** The toolbar's reading direction, `ltr` unless it says otherwise. */
const directionOf = (globals: Record<string, unknown>) => (globals.direction === 'rtl' ? 'rtl' : 'ltr');

/** The document language: the toolbar's (`auto` follows the direction), so hyphenation and font fallback match. */
const langOf = (globals: Record<string, unknown>) =>
  typeof globals.lang === 'string' && globals.lang !== 'auto'
    ? globals.lang
    : directionOf(globals) === 'rtl'
      ? 'ar'
      : 'zh-CN';

/** Theme, font and palette through theme-init's own switches: <html> attributes, on the docs pages too. */
function applyAppearance(globals: Record<string, unknown>) {
  window.koiSetTheme?.(globals.theme === 'light' || globals.theme === 'dark' ? globals.theme : null);
  window.koiSetFont?.(globals.font === 'chill' ? 'chill' : null);
  window.koiSetPalette?.(typeof globals.palette === 'string' && globals.palette !== 'koi' ? globals.palette : null);
}

/**
 * Canvas only: what an app writes on <html>. `dir` drives CSS (`:dir()`, logical properties) and `lang` hyphenation
 * and font fallback. A docs page shows several stories at once, so it scopes both to a wrapper instead (see the
 * decorator) rather than letting the last story rendered win for the whole page.
 */
function applyDocumentDirection(globals: Record<string, unknown>) {
  document.documentElement.dir = directionOf(globals);
  document.documentElement.lang = langOf(globals);
}

/** Docs pages follow the toolbar theme too, or dark components land on a white page. */
function KoiDocsContainer(props: PropsWithChildren<DocsContainerProps>) {
  // Not in DocsContainerProps' types, but the docs context carries the store with the current globals.
  const globals = (props.context as unknown as { store: { userGlobals: { globals: Record<string, unknown> } } }).store
    .userGlobals.globals;
  applyAppearance(globals);
  const dark = document.documentElement.dataset.theme === 'dark';
  return <DocsContainer {...props} theme={dark ? themes.dark : themes.light} />;
}

const preview: Preview = {
  tags: ['autodocs'],
  // Toolbar switches. scripts/shots.mjs sets them through the URL (`&globals=theme:dark`).
  globalTypes: {
    theme: {
      description: '主题',
      toolbar: {
        title: '主题',
        icon: 'mirror',
        items: [
          { value: 'auto', title: '跟随系统' },
          { value: 'light', title: '浅色' },
          { value: 'dark', title: '深色' },
        ],
        dynamicTitle: true,
      },
    },
    font: {
      description: '字体',
      toolbar: {
        title: '字体',
        icon: 'paragraph',
        items: [
          { value: 'system', title: '系统字体' },
          { value: 'chill', title: '寒蝉全圆体' },
        ],
        dynamicTitle: true,
      },
    },
    // The built-in palettes in @tuuject/koi-tokens (tokens.json `color.palettes`).
    palette: {
      description: '配色',
      toolbar: {
        title: '配色',
        icon: 'paintbrush',
        items: [
          { value: 'koi', title: 'Koi（天蓝 + 琥珀）' },
          { value: 'rose', title: 'Rose（玫红 + 紫罗兰）' },
        ],
        dynamicTitle: true,
      },
    },
    // The document language, for hyphenation and font fallback. `auto` follows the direction (Arabic for RTL).
    lang: {
      description: '语言',
      toolbar: {
        title: '语言',
        icon: 'globe',
        items: [
          { value: 'auto', title: '跟随方向（中文 / العربية）' },
          { value: 'zh-CN', title: '中文' },
          { value: 'ar', title: 'العربية' },
          { value: 'de', title: 'Deutsch' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
    // Reading direction. Sets <html dir> (canvas) or the story's own `dir` (docs) and wraps every story in Koi's
    // DirectionProvider, so floating placement, arrow-key navigation and the recipes' logical properties follow it.
    direction: {
      description: '方向',
      toolbar: {
        title: '方向',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: '从左到右（LTR）' },
          { value: 'rtl', title: '从右到左（RTL）' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'auto', font: 'system', palette: 'koi', direction: 'ltr', lang: 'auto' },
  decorators: [
    (Story, { globals, viewMode }) => {
      applyAppearance(globals);
      const direction = directionOf(globals);
      if (viewMode === 'docs') {
        // Docs pages render several stories together: scope `dir`/`lang` to this one instead of rewriting <html>.
        // `display: contents`: the wrapper carries the direction without adding a box to the docs layout.
        return (
          <DirectionProvider direction={direction}>
            <div dir={direction} lang={langOf(globals)} style={{ display: 'contents' }}>
              <Story />
            </div>
          </DirectionProvider>
        );
      }
      // Canvas: the document is the app's `<html dir lang>`, the provider is the app's `DirectionProvider`.
      applyDocumentDirection(globals);
      return (
        <DirectionProvider direction={direction}>
          <Story />
        </DirectionProvider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    controls: { expanded: true },
    docs: { container: KoiDocsContainer },
    options: { storySort: { order: ['Introduction', 'Components'] } },
  },
};

export default preview;
