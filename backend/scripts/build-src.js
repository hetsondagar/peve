const { execSync } = require('child_process');

function getIgnoreDeprecationsValue() {
  // TS5 accepts 5.0 while TS6+ requires 6.0 for node10 deprecation suppression.
  const tsVersion = require('typescript/package.json').version;
  const major = Number.parseInt(tsVersion.split('.')[0], 10);
  return major >= 6 ? '6.0' : '5.0';
}

function run(command) {
  execSync(command, { stdio: 'inherit' });
}

const ignoreDeprecations = getIgnoreDeprecationsValue();

run(`tsc -p tsconfig.production.json --ignoreDeprecations ${ignoreDeprecations}`);
run(
  `tsc src/index-clean.ts --outDir dist --target ES2020 --module CommonJS --moduleResolution node --ignoreDeprecations ${ignoreDeprecations} --esModuleInterop --skipLibCheck`
);
