// Panda runs as a PostCSS plugin with the single root config (../../panda.config.ts).
module.exports = {
  plugins: {
    '@pandacss/dev/postcss': { configPath: '../../panda.config.ts', cwd: '../..' },
  },
};
