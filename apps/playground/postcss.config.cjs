// Panda runs as a PostCSS plugin with the single root config (../../panda.config.ts).
// Absolute paths: Panda resolves configPath against cwd, and the dev server and shots.mjs can start from either directory.
const path = require('node:path');
const root = path.resolve(__dirname, '../..');

module.exports = {
  plugins: {
    '@pandacss/dev/postcss': { configPath: path.join(root, 'panda.config.ts'), cwd: root },
  },
};
