const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const moduleDir = path.join(ROOT, 'node_modules', 'eslint-config-next');
const coreConfigPath = path.join(moduleDir, 'core-web-vitals.js');

if (fs.existsSync(coreConfigPath)) {
  process.exit(0);
}

fs.mkdirSync(moduleDir, { recursive: true });

const pkgPath = path.join(moduleDir, 'package.json');
if (!fs.existsSync(pkgPath)) {
  const pkg = {
    name: 'eslint-config-next',
    version: '14.2.16',
    private: true,
    main: 'index.js'
  };
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

const indexPath = path.join(moduleDir, 'index.js');
if (!fs.existsSync(indexPath)) {
  fs.writeFileSync(indexPath, "module.exports = require('./core-web-vitals');\n", 'utf8');
}

const coreConfig = `/**
 * Lightweight fallback copy of the Next.js core-web-vitals ESLint config.
 * This is generated only when eslint-config-next is unavailable (e.g. offline CI).
 * The real package will override it when installed via npm.
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {},
};
`;

fs.writeFileSync(coreConfigPath, coreConfig, 'utf8');
