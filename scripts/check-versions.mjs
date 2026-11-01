// Fails when the @tuuject packages drift to different versions. They are published together
// (`pnpm version:bump` bumps all four), and the design-system manifest embeds the package version.
import { readFileSync } from 'node:fs';

const packages = ['tokens', 'core', 'react', 'native'];
const versions = packages.map((dir) => {
  const pkg = JSON.parse(readFileSync(`packages/${dir}/package.json`, 'utf8'));
  return { dir, name: pkg.name, version: pkg.version };
});

const unique = new Set(versions.map((entry) => entry.version));
if (unique.size !== 1) {
  console.error(
    `@tuuject package versions differ: ${versions.map((entry) => `${entry.name}@${entry.version}`).join(', ')}`,
  );
  console.error('Run `pnpm version:bump <type>` to put them on one version.');
  process.exit(1);
}

console.log(`@tuuject packages at ${versions[0].version} (${versions.length} packages).`);
