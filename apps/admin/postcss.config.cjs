// Panda runs as a PostCSS plugin with the single root config (../../panda.config.ts), same as the
// Storybook app. Absolute paths: Panda resolves configPath against cwd, and the dev server can start
// from either the repo root or this directory.
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

module.exports = {
  plugins: {
    '@pandacss/dev/postcss': { configPath: path.join(root, 'panda.config.ts'), cwd: root },
  },
};
