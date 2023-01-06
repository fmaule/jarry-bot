// LOGGER
const path = require('node:path');
const { initLogger } = require('./logger');
const componentName = path.parse(__filename).name;
const { log, logError } = initLogger(componentName);

const initStats = async (config, mongodb, tracker) => {
  log('∝ initializing component');

  const getUser = async (userId) => {
    log(`fetching stats for user ${userId}`);

    const { originId } = await mongodb.getPlatformUserIdentifierById(userId);

    if (!originId) {
      throw new Error(`User ${userId} not found`);
    }

    const stats = await tracker.getProfileStats(originId)
    console.log(stats)
    return stats;
  };

  return {
    getUser,
  };
};

module.exports = {
  initStats,
};
