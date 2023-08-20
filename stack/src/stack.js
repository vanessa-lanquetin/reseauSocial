const pathfs = require('path');

const rootPath = pathfs.resolve(__dirname, '..', '..');
const localEnvs = require('./env/local.override')

/** @type {import('@iryu54/stack-monitor').StackFile} */
const stack = async (stackMonitor) => {
  return {
    watchFiles: [
      require.resolve("./env/local"),
      pathfs.resolve(__dirname, "env", "local.override.js"),
    ],
    logParsers: [
      stackMonitor.parsers.links,
      stackMonitor.parsers.jsons,
      stackMonitor.parsers.debug,
    ],
    services: [
      {
        label: "social-network-server",
        git: {
          home: "https://github.com/vanessa-lanquetin/reseauSocial",
          remote: "git@github.com:vanessa-lanquetin/reseauSocial.git",
        },
        rootPath,
        spawnCmd: "npm",
        spawnArgs: ["run", "serve"],
        spawnOptions: {
          cwd: pathfs.resolve(rootPath, "server"),
          env: {
            PORT: "5000",
            MONGODB_URL: localEnvs.MONGODB_URL,
            TOKEN: localEnvs.TOKEN,
            CLIENT_URL: "http//localhost:3000",
          },
        },
      },
      {
        label: "social-network-front",
        git: {
          home: "https://github.com/vanessa-lanquetin/reseauSocial",
          remote: "git@github.com:vanessa-lanquetin/reseauSocial.git",
        },
        rootPath,
        spawnCmd: "npm",
        spawnArgs: ["run", "start"],
        spawnOptions: {
          cwd: pathfs.resolve(rootPath, "client"),
          env: {
          },
        },
      },
    ],
  };
};

module.exports = stack;
