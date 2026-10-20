# Koi

A soft, rounded design system, grown out of tcdw's Koi blog theme. One set of tokens; components for DOM web apps (Base UI + Panda CSS v2) and for Expo apps (Tamagui, in progress).

```sh
nvm use            # the Node version in .nvmrc
pnpm install
pnpm dev           # builds tokens, runs Panda codegen, starts Storybook (localhost:6006; log in .temp/dev-storybook.log)
pnpm shots         # screenshots of every story, light + dark
pnpm check         # contrast, raw-color / raw-size / headless / core checks, typecheck
```

- Working with an AI agent: start with `AGENTS.md`; topic docs and the plan are in `agent-doc/`.
- Design spec: `docs/spec/README.md` and `docs/spec/components/`.
- Previous implementation, for reference: `reference/legacy-web/example.html`.

| Package | What |
| --- | --- |
| `packages/tokens` | `src/tokens.json` → CSS variables, Panda preset, theme-init script, plain numbers for every size, runtime palettes, React Native values. Contrast checks. |
| `packages/core` | Each component's props contract, UI copy and pure helpers, shared by web and native. No DOM. |
| `packages/react` | Web components: Button, IconButton, Spinner, Skeleton, Badge, Divider, Card, Alert, Link, Field, Input, Textarea, Select, SelectPanel, Checkbox, RadioGroup, Switch, Tabs, Tooltip, Avatar, Progress, Dialog, Pagination, Tag, Toast. |
| `packages/native` | Expo components on Tamagui. So far the Tamagui config, built from the tokens. |
| `apps/storybook` | Storybook: an introduction to Koi and every component's stories. Also the visual test bed (`pnpm shots`). |
