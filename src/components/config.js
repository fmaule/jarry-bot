const { getSecrets } = require('docker-secret');

// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log } = initLogger(componentName);

const initConfig = async () => {
  log('∝ initializing component');
  
  const secrets = getSecrets(process.env.SECRET_DIR);
  const config = {
    discord: {
      token: secrets.BOT_DISCORD_TOKEN,
      clientId: '1060895467933806642',
      guildId: '762775384746885150',
      channels: {
        debuglog: '1061439947057414144'
      }
    },
    tracker: {
      token: secrets.BOT_TRACKER_TOKEN,
    },
    mongodb: {
      uri: secrets.BOT_MONGO_URI,
      dbName: 'jarry-dev',
      usersCollection: 'users',
      statsCollection: 'stats',
    },
  };

  return config;
};

module.exports = {
  initConfig,
};
