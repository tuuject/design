# reference/ (frozen)

`legacy-web/` is the Koi design system exactly as exported from Claude on 2026-10-08 (artifact Version 34): a plain React 18 bundle on `window.Koi` with hand-written CSS. Open `legacy-web/example.html` in a browser to see it run.

Use it as the **behavioral and visual reference** when porting a component: the CSS in `components/bundle.css` and the logic in `components/bundle.js` are what the new Panda + Base UI versions should match, unless `docs/spec/` says otherwise. Don't edit anything in here, and don't import from it.

Note: this snapshot's font stack is the Apple system-font test (`-apple-system, BlinkMacSystemFont, "PingFang SC", …`). The ChillRoundF files are included in `legacy-web/fonts/` in case the font comes back.
