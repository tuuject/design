# Koi design system — files

Open `example.html` in a browser to see everything working from these files alone.

## Load order (any web page)

1. `components/fonts.css`: the ChillRoundF font (121 subset files in `fonts/`, fetched only as needed). Note: this snapshot's `--font-sans` is the Apple system-font test stack (`-apple-system, BlinkMacSystemFont, "PingFang SC"…`), so ChillRoundF is declared but not used. To switch back, put `ChillRoundF, ` at the front of `type.families.sans` in `tokens.json` and of `--font-sans` in `tokens.css`.
2. `tokens.css`: every token as a CSS variable (`--surface`, `--action`, `--radius-panel`…). Dark mode follows the OS; force a theme with `<html data-theme="dark">` or `"light"`. Type styles are classes such as `koi-type-heading-2`.
3. `components/bundle.css`: component styles.
4. React 18: `components/lib/react.production.min.js` and `react-dom.production.min.js`, or your own React 18.
5. `components/bundle.js`: defines `window.Koi` (`Koi.Button`, `Koi.Field`, `Koi.useToast`…).

## What's where

| Path | What |
| --- | --- |
| `README.md` | The brand book: how to use color, type, shape, motion and copy. Read this first. |
| `tokens.json` | The source of truth for every token, with usage notes and light/dark values. |
| `tokens.css` | Those tokens compiled to CSS variables. |
| `components/bundle.js`, `bundle.css` | The 25 React components and their styles (including NavMenu and Skeleton). |
| `components/index.d.ts` | TypeScript types for every component's props. |
| `components/<Name>/README.md` | When to use each component, what it needs, how it's styled. |
| `components/<Name>/preview.html` | The examples shown in Claude. They expect the design-system page to provide tokens and scripts, so open `example.html` instead to try things locally. |
| `fonts/`, `components/fonts.css` | ChillRoundF (寒蝉全圆体), SIL Open Font License 1.1; license details are in the header of `fonts.css`. |
| `components/lib/` | React 18.3.1 (MIT). |

## In an Astro or Vite project

Copy the folder into your project, import the three stylesheets once (for example in your layout), and either load the scripts as above or use the components inside a React island via `window.Koi`. If you only want the look without React, `tokens.css` and the token names work with plain HTML, Svelte or Tailwind.
