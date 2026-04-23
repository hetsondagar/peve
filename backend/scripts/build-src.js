const { execSync } = require('child_process');

function getTscVersion() {
  try {
    const output = execSync('tsc --version', { encoding: 'utf8' }).trim();
    const match = output.match(/(\d+)\.(\d+)\.(\d+)/);
    if (match) return match[0];
  } catch (_) {
    // Fall back to the installed package version.
  }

  try {
    return require('typescript/package.json').version;
  } catch (_) {
    throw new Error('Unable to determine TypeScript version for build');
  }
}

function getIgnoreDeprecationsValue() {
  // Match the version used by the active tsc binary.
  const tsVersion = getTscVersion();
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
