import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import { mergeConfig } from 'vite';

const root = fileURLToPath(new URL('../../..', import.meta.url));

const config: StorybookConfig = {
  // Introduction.mdx first, so it is the landing page.
  stories: ['../src/Introduction.mdx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  core: { disableTelemetry: true, disableWhatsNewNotifications: true },
  features: { sidebarOnboardingChecklist: false },
  viteFinal: (config) =>
    mergeConfig(config, {
      plugins: [react()],
      resolve: {
        alias: {
          // packages/react imports its generated Panda code by package name; point that at the generated folder.
          '@tuuject/koi-react/styled-system': `${root}packages/react/styled-system`,
        },
      },
      // X-Koi-Checkout: which checkout serves port 6006, for scripts/dev-server.mjs (worktrees share the port).
      server: { fs: { allow: [root] }, headers: { 'X-Koi-Checkout': encodeURIComponent(root) } },
    }),
};

export default config;
