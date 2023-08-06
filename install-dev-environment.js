const fs = require('fs');
const pathfs = require('path');

(() => {
  console.log('Generate all override env files');
  const pathToStack = pathfs.resolve(__dirname, 'stack', 'src', 'env');
  generateOverrides(pathToStack);
})();

async function generateOverrides(path) {
  ['local'].forEach((env) => {
    const pathToEnvOverride = pathfs.resolve(path, `${env}.override.js`);
    if (!fs.existsSync(pathToEnvOverride)) {
      fs.writeFileSync(
        pathToEnvOverride,
        `const envs = require('./${env}');
  module.exports = {
    ...envs,
    // Override envs here ...
  };
  `,
        { encoding: 'utf-8' },
      );
    }
  });
}
