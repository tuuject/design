# Koi

A soft, rounded design system, grown out of tcdw's Koi blog theme. Tokens in one place; components for React web (Base UI + Panda CSS v2) now, React Native later.

```sh
nvm use            # Node 22+ (Panda v2 needs it)
pnpm install
pnpm dev           # builds tokens, runs Panda codegen, starts Storybook (localhost:6006)
pnpm shots         # screenshots of every story, light + dark
pnpm check         # contrast, raw-color scan, typecheck
```

- Working with Claude Code: start with `CLAUDE.md`, then `docs/plan.md` (Phase 0 first: the web toolchain hasn't been run yet).
- Design spec: `docs/spec/README.md` and `docs/spec/components/`.
- Previous implementation, for reference: `reference/legacy-web/example.html`.

| Package | What |
| --- | --- |
| `packages/tokens` | `src/tokens.json` → CSS variables, Panda preset, theme-init script, React Native values. Contrast checks. |
| `packages/react` | Components: Button, IconButton, Spinner, Skeleton, Badge, Divider and Dialog so far. |
| `packages/native` | Not started. |
| `apps/storybook` | Storybook: an introduction to Koi and every component's stories. Also the visual test bed (`pnpm shots`). |
