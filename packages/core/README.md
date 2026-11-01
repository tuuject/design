# @tuuject/koi-core

Koi's platform-neutral layer: each component's props contract (`<Name>OwnProps`), the `ChangeDetails` passed to callbacks, the UI copy in `strings`, and the pure helpers behind the components.

`@tuuject/koi-react` builds the DOM components on top of it, and a native package uses the same contracts. There is no DOM, no styling and no headless library here, so the package runs anywhere TypeScript does.

You normally get it transitively. Install it directly only if you write a Koi platform package or want the prop types without the React implementation:

```sh
pnpm add @tuuject/koi-core
```

```ts
import type { ButtonOwnProps } from '@tuuject/koi-core';
```

Repository and design spec: <https://github.com/tuuject/design>
