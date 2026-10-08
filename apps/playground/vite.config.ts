import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // packages/react imports its generated Panda code by package name; point that at the generated folder.
      '@koi/react/styled-system': fileURLToPath(new URL('../../packages/react/styled-system', import.meta.url)),
    },
  },
  server: { fs: { allow: ['../..'] } },
});
