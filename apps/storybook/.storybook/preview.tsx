import '@koi/tokens/theme-init.js'; // sets <html data-theme> from the OS (in an app, inline it in <head> to avoid a flash)
import '@koi/tokens/fonts.css'; // ChillRoundF subsets; only used with <html data-font="chill">
import '../src/index.css';
import type * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';

/** Applies the toolbar's theme and font through theme-init's own switches. */
function applyGlobals(globals: Record<string, unknown>) {
  window.koiSetTheme?.(globals.theme === 'light' || globals.theme === 'dark' ? globals.theme : null);
  window.koiSetFont?.(globals.font === 'chill' ? 'chill' : null);
}

/** Docs pages follow the toolbar theme too, or dark components land on a white page. */
function KoiDocsContainer(props: React.PropsWithChildren<DocsContainerProps>) {
  // Not in DocsContainerProps' types, but the docs context carries the store with the current globals.
  const globals = (props.context as unknown as { store: { userGlobals: { globals: Record<string, unknown> } } }).store.userGlobals.globals;
  applyGlobals(globals);
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
  },
  initialGlobals: { theme: 'auto', font: 'system' },
  decorators: [
    (Story, { globals }) => {
      applyGlobals(globals);
      return <Story />;
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
